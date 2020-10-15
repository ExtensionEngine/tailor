'use strict';

const {
  Activity,
  ContentElement,
  Sequelize: { Op },
  sequelize
} = require('../database');
const {
  getLevelRelationships,
  getOutlineLevels,
  getSupportedContainers
} = require('../../../config/shared/activities');
const { containerRegistry } = require('../content-plugins');
const filter = require('lodash/filter');
const find = require('lodash/find');
const findIndex = require('lodash/findIndex');
const get = require('lodash/get');
const hash = require('hash-obj');
const keys = require('lodash/keys');
const map = require('lodash/map');
const omit = require('lodash/omit');
const pick = require('lodash/pick');
const Promise = require('bluebird');
const reduce = require('lodash/reduce');
const { resolveStatics } = require('../storage/helpers');
const storage = require('../storage');
const without = require('lodash/without');

const { FLAT_REPO_STRUCTURE } = process.env;

const CC_ATTRS = ['id', 'uid', 'type', 'position', 'createdAt', 'updatedAt'];

function publishActivity(activity) {
  return getStructureData(activity).then(data => {
    const { repository, predecessors, spine } = data;
    predecessors.forEach(it => {
      const exists = find(spine.structure, { id: it.id });
      if (!exists) addToSpine(spine, it);
    });
    activity.publishedAt = new Date();
    addToSpine(spine, activity);
    return publishContent(activity).then(content => {
      attachContentSummary(find(spine.structure, { id: activity.id }), content);
      return saveSpine(spine)
        .then(savedSpine => updateRepositoryCatalog(repository, savedSpine.publishedAt))
        .then(() => updatePublishingStatus(repository, activity))
        .then(() => activity.save());
    });
  });
}

function getRepositoryCatalog() {
  return storage.getFile('repository/index.json').then(buffer => {
    if (!buffer) return [];
    return JSON.parse(buffer.toString('utf8'));
  });
}

function updateRepositoryCatalog(repository, publishedAt) {
  return getRepositoryCatalog().then(catalog => {
    const existing = find(catalog, { id: repository.id });
    if (!existing && repository.deletedAt) return;
    const repositoryData = {
      ...getRepositoryAttrs(repository),
      publishedAt: publishedAt || existing.publishedAt,
      detachedAt: repository.deletedAt
    };
    if (existing) {
      Object.assign(existing, omit(repositoryData, ['id']));
    } else {
      catalog.push(repositoryData);
    }
    const data = Buffer.from(JSON.stringify(catalog), 'utf8');
    return storage.saveFile('repository/index.json', data);
  });
}

function publishRepositoryDetails(repository) {
  return getPublishedStructure(repository).then(async spine => {
    Object.assign(spine, getRepositoryAttrs(repository));
    await updatePublishingStatus(repository);
    return saveSpine(spine)
      .then(savedSpine => updateRepositoryCatalog(repository, savedSpine.publishedAt));
  });
}

function unpublishActivity(repository, activity) {
  return getPublishedStructure(repository).then(spine => {
    const spineActivity = find(spine.structure, { id: activity.id });
    if (!spineActivity) return;
    const deleted = getSpineChildren(spine, activity).concat(spineActivity);
    return Promise.map(deleted, it => {
      const filenames = getContentContainerFilenames(it);
      return Promise.map(filenames, filename => {
        const key = `${getBaseUrl(repository.id, it.id)}/${filename}.json`;
        return storage.deleteFile(key);
      });
    }).then(() => {
      spine.structure = filter(spine.structure, ({ id }) => !find(deleted, { id }));
      return saveSpine(spine)
        .then(savedSpine => updateRepositoryCatalog(repository, savedSpine.publishedAt))
        .then(() => activity.save());
    });
  });
}

function getStructureData(activity) {
  const repoData = activity.getRepository().then(repository => {
    return getPublishedStructure(repository).then(spine => ({ repository, spine }));
  });
  return Promise.all([repoData, activity.predecessors()])
    .spread((repoData, predecessors) => Object.assign(repoData, { predecessors }));
}

function getPublishedStructure(repository) {
  const storageKey = `repository/${repository.id}/index.json`;
  return storage.getFile(storageKey).then(buffer => {
    const data = buffer && JSON.parse(buffer.toString('utf8'));
    return data || { ...getRepositoryAttrs(repository), structure: [] };
  });
}

async function fetchActivityContent(activity, signed = false) {
  let containers = await fetchContainers(activity);
  if (signed) containers = await Promise.map(containers, resolveContainer);
  return { containers };
}

function publishContent(activity) {
  return publishContainers(activity).then(containers => ({ containers }));
}

function publishContainers(parent) {
  return fetchContainers(parent)
    .map(it => {
      const { id, publishedAs = 'container' } = it;
      return saveFile(parent, `${id}.${publishedAs}`, it).then(() => it);
    });
}

function fetchContainers(parent) {
  const typeConfigs = getSupportedContainers(parent.type);

  return Promise.all([
    fetchDefaultContainers(parent, typeConfigs),
    fetchCustomContainers(parent, typeConfigs)
  ])
  .reduce((containers, groupedContainers) => {
    const mappedContainers = groupedContainers.map(it => {
      const config = find(typeConfigs, { type: it.type });
      const publishedAs = get(config, 'publishedAs', 'container');
      return { ...it, publishedAs, templateId: config.templateId };
    });
    return containers.concat(mappedContainers);
  }, []);
}

function fetchDefaultContainers(parent, config) {
  const include = [{ model: ContentElement.scope('publish') }];
  const types = config
    .filter(it => !containerRegistry.getPublishStructureBuilder(it))
    .map(it => it.type);
  const where = { type: types };

  return parent
    .getChildren({ attributes: CC_ATTRS, where, include })
    .map(container => {
      const { ContentElements: ces, ...data } = container.toJSON();
      const elements = map(ces, (it, pos) => ({ ...it, position: pos + 1 }));
      return { ...data, elements };
    });
}

async function fetchCustomContainers(parent, config) {
  const include = [{ model: ContentElement.scope('publish') }];
  return Promise.reduce(config, async (containers, it) => {
    const builder = containerRegistry.getPublishStructureBuilder(it);
    if (!builder) return containers;
    const customContainers = await builder(parent, it.type, { include });
    return containers.concat(customContainers);
  }, []);
}

function resolveContainer(container) {
  const resolver = containerRegistry.getStaticsResolver(container);
  return resolver
    ? resolver(container, resolveStatics)
    : Promise.map(container.elements, resolveStatics).then(() => container);
}

function saveFile(parent, key, data) {
  const buffer = Buffer.from(JSON.stringify(data), 'utf8');
  const baseUrl = getBaseUrl(parent.repositoryId, parent.id);
  return storage.saveFile(`${baseUrl}/${key}.json`, buffer);
}

function saveSpine(spine) {
  const hashProperties = pick(spine, without(keys(spine), ['version', 'publishedAt']));
  const version = hash(hashProperties, { algorithm: 'sha1' });
  const updatedSpine = { ...spine, version, publishedAt: new Date() };
  const spineData = Buffer.from(JSON.stringify(updatedSpine), 'utf8');
  const key = `repository/${spine.id}/index.json`;
  return storage.saveFile(key, spineData).then(() => updatedSpine);
}

function addToSpine(spine, activity) {
  const relationships = getLevelRelationships(activity.type);
  activity = Object.assign(
    pick(activity, [
      'id', 'uid', 'parentId', 'type', 'position', 'data',
      'publishedAt', 'updatedAt', 'createdAt'
    ]), {
      relationships: mapRelationships(relationships, activity)
    }
  );
  renameKey(activity, 'data', 'meta');
  const index = findIndex(spine.structure, { id: activity.id });
  if (index < 0) {
    spine.structure.push(activity);
  } else {
    spine.structure[index] = activity;
  }
}

function getSpineChildren(spine, parent) {
  const children = filter(spine.structure, { parentId: parent.id });
  if (!children.length) return [];
  return children.concat(reduce(children, (acc, it) => {
    return acc.concat(getSpineChildren(spine, it));
  }, []));
}

function getRepositoryAttrs(repository) {
  const attrs = ['id', 'uid', 'schema', 'name', 'description', 'data'];
  const temp = pick(repository, attrs);
  renameKey(temp, 'data', 'meta');
  return temp;
}

function attachContentSummary(obj, { containers }) {
  obj.contentContainers = map(containers, getContainerSummary);
}

function getContainerSummary(container) {
  const customBuilder = containerRegistry.getSummaryBuilder(container);
  return customBuilder
    ? customBuilder(container)
    : defaultSummaryBuilder(container);
}

function defaultSummaryBuilder({ id, uid, type, publishedAs, elements = [] }) {
  return { id, uid, type, publishedAs, elementCount: elements.length };
}

function getContentContainerFilenames({ contentContainers = [] }) {
  return map(contentContainers, it => `${it.id}.${it.publishedAs}`);
}

function renameKey(obj, key, newKey) {
  obj[newKey] = obj[key];
  delete obj[key];
}

function getBaseUrl(repoId, parentId) {
  return FLAT_REPO_STRUCTURE
    ? `repository/${repoId}`
    : `repository/${repoId}/${parentId}`;
}

function mapRelationships(relationships, activity) {
  return relationships.reduce((acc, { type }) => {
    return Object.assign(acc, { [type]: get(activity, `refs.${type}`, []) });
  }, {});
}

// check if there is at least one outline activity with unpublished
// changes and upadate repository model accordingly
async function updatePublishingStatus(repository, activity) {
  const outlineTypes = map(getOutlineLevels(repository.schema), 'type');
  const where = {
    repositoryId: repository.id,
    type: outlineTypes,
    detached: false,
    [Op.or]: {
      publishedAt: { [Op.eq]: null },
      modifiedAt: { [Op.gt]: sequelize.col('published_at') }
    }
  };
  if (activity) where.id = { [Op.ne]: activity.id };
  const unpublishedCount = await Activity.count({ where });
  return repository.update({ hasUnpublishedChanges: !!unpublishedCount });
}

module.exports = {
  getRepositoryCatalog,
  publishActivity,
  unpublishActivity,
  publishRepositoryDetails,
  updateRepositoryCatalog,
  updatePublishingStatus,
  fetchActivityContent,
  getRepositoryAttrs
};
