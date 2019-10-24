'use strict';

const {
  getLevelRelationships, getSupportedContainers
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
const { TeachingElement } = require('../database');
const without = require('lodash/without');

const { FLAT_REPO_STRUCTURE } = process.env;

const TES_ATTRS = [
  'id', 'uid', 'type', 'contentId', 'contentSignature',
  'position', 'data', 'meta', 'refs', 'createdAt', 'updatedAt'
];

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
        .then(() => activity.save());
    });
  });
}

function updateRepositoryCatalog(repository, publishedAt) {
  return storage.getFile('repository/index.json').then(buffer => {
    const catalog = (buffer && JSON.parse(buffer.toString('utf8'))) || [];
    const existing = find(catalog, { id: repository.id });
    const repositoryData = { ...getRepositoryAttrs(repository), publishedAt };
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
  return getPublishedStructure(repository).then(spine => {
    Object.assign(spine, getRepositoryAttrs(repository));
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
      const filenames = getActivityFilenames(it);
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
  const repoData = activity.getCourse().then(repository => {
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
  const res = await Promise
    .all([fetchContainers(activity), fetchAssessments(activity)])
    .spread((containers, assessments) => ({ containers, assessments }));
  if (!signed) return res;
  const [containers, assessments] = await Promise.all([
    Promise.map(res.containers, resolveContainer),
    resolveAssessments(res.assessments)
  ]);
  return Object.assign(res, { containers, assessments });
}

function publishContent(activity) {
  return Promise.all([
    publishContainers(activity),
    publishAssessments(activity)
  ]).spread((containers, assessments) => ({ containers, assessments }));
}

function publishContainers(parent) {
  return fetchContainers(parent)
    .map(it => {
      const { id, publishedAs = 'container' } = it;
      return saveFile(parent, `${id}.${publishedAs}`, it).then(() => it);
    });
}

function publishAssessments(parent) {
  return fetchAssessments(parent).then(assessments => {
    const key = getAssessmentsKey(parent);
    return saveFile(parent, key, assessments).then(() => assessments);
  });
}

function fetchContainers(parent) {
  const typeConfigs = getSupportedContainers(parent.type);
  const isCore = it => !containerRegistry.getStaticsResolver(it.type);
  const coreTypes = typeConfigs.filter(isCore).map(it => it.type);

  return Promise.all([
    parent.getChildren({ where: { type: coreTypes } }).map(fetchDefaultContainer),
    fetchCustomContainers(parent)
  ])
  .reduce((containers, groupedContainers) => {
    const mappedContainers = groupedContainers.map(it => {
      const config = find(typeConfigs, { type: it.type });
      const publishedAs = get(config, 'publishedAs', 'container');
      return { ...it, publishedAs };
    });
    return containers.concat(mappedContainers);
  }, []);
}

function fetchDefaultContainer(container) {
  const order = [['position', 'ASC']];
  return container
    .getTeachingElements({ attributes: TES_ATTRS, order })
    .then(tes => ({
      ...pick(container, ['id', 'uid', 'type', 'position', 'createdAt', 'updatedAt']),
      elements: map(tes, (it, pos) => Object.assign(it, { position: pos + 1 }))
    }));
}

function fetchCustomContainers(parent) {
  const options = { include: [{ model: TeachingElement, attributes: TES_ATTRS }] };
  return containerRegistry.fetch(parent, options);
}

function fetchAssessments(parent) {
  const options = { where: { type: 'ASSESSMENT' }, attributes: TES_ATTRS };
  return parent.getTeachingElements(options);
}

function resolveContainer(container) {
  const { elements, type } = container;
  const resolver = containerRegistry.getStaticsResolver(type);
  return resolver
    ? resolver(container, resolveStatics)
    : Promise.map(elements, resolveStatics).then(() => container);
}

function resolveAssessments(assessments) {
  return Promise.map(assessments, resolveStatics);
}

function saveFile(parent, key, data) {
  const buffer = Buffer.from(JSON.stringify(data), 'utf8');
  const baseUrl = getBaseUrl(parent.courseId, parent.id);
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

function attachContentSummary(obj, { containers, assessments }) {
  obj.contentContainers = map(containers, it => ({
    ...pick(it, ['id', 'uid', 'type', 'publishedAs']),
    elementCount: get(it.elements, 'length', 0)
  }));
  obj.assessments = map(assessments, it => pick(it, ['id', 'uid']));
}

function getActivityFilenames(spineActivity) {
  const { contentContainers = [], assessments = [] } = spineActivity;
  const filenames = [];
  if (assessments.length) filenames.push(getAssessmentsKey(spineActivity));
  filenames.push(...map(contentContainers, it => `${it.id}.${it.publishedAs}`));
  return filenames;
}

function renameKey(obj, key, newKey) {
  obj[newKey] = obj[key];
  delete obj[key];
}

function getAssessmentsKey(parent) {
  return FLAT_REPO_STRUCTURE ? `${parent.id}.assessments` : 'assessments';
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

module.exports = {
  publishActivity,
  unpublishActivity,
  publishRepositoryDetails,
  fetchActivityContent
};
