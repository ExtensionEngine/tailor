'use strict';

const {
  Activity,
  ContentElement,
  Repository,
  Revision,
  sequelize
} = require('../shared/database');
const find = require('lodash/find');
const fromPairs = require('lodash/fromPairs');
const get = require('lodash/get');
const Listr = require('listr');
const { Op } = require('sequelize');
const path = require('path');
const Promise = require('bluebird');
const { protocol } = require('../../config/server/storage');
const { SCHEMAS } = require('../../config/shared/activities');
const storage = require('../repository/storage');
const toPairs = require('lodash/toPairs');

const regex = /repository\/assets\/(.*)/;
const REVISION_TYPES = ['REPOSITORY', 'ACTIVITY', 'CONTENT_ELEMENT'];
const CHUNK_SIZE = 2000;

const mapEntityToAction = {
  REPOSITORY: migrateRepository,
  ACTIVITY: migrateActivity,
  CONTENT_ELEMENT: migrateContentElement
};

migrate()
  .then(({ transaction }) => transaction.commit())
  .then(() => {
    console.info('Migration script was executed successfully.');
    process.exit(0);
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });

async function migrate() {
  const transaction = await sequelize.transaction();
  const tasks = await getMigrationTasks(transaction);
  return tasks.run({ transaction });
}

async function getMigrationTasks(transaction) {
  const repositories = await Repository.findAll({ transaction });
  const tasks = repositories.map(repository => ({
    title: `Migrate repository: "${repository.name}"`,
    task: () => getRepositoryTasks(repository, transaction)
  }));
  return new Listr(tasks);
}

async function getRepositoryTasks(repository, transaction) {
  const schemaFileMetas = getFileMetasForSchema(repository.schema);
  return new Listr([
    {
      title: 'Migrate repository',
      task: () => migrateRepositoryAssets(repository, schemaFileMetas, transaction)
    },
    {
      title: 'Migrate activities',
      task: () => migrateRepositoryActivities(repository.id, schemaFileMetas, transaction)
    },
    {
      title: 'Migrate content elements',
      task: () => migrateRepositoryContentElements(repository.id, schemaFileMetas, transaction)
    },
    {
      title: 'Migrate revisions',
      task: () => migrateRepositoryRevisions(repository.id, schemaFileMetas, transaction)
    }
  ]);
}

function getFileMetasForSchema(schemaId) {
  const schema = find(SCHEMAS, { id: schemaId });
  return {
    repositoryMeta: getRepositoryMeta(schema),
    activityTypeMetaMap: getActivityTypeMetaMap(schema),
    elementTypeMetaMap: getElementTypeMetaMap(schema)
  };
}

function getRepositoryMeta({ meta }) {
  return getFileMetaKeys(meta);
}

function getActivityTypeMetaMap({ structure }) {
  const metas = structure.map(({ type, meta }) => [type, getFileMetaKeys(meta)]);
  return fromPairs(metas);
}

function getElementTypeMetaMap({ elementMeta }) {
  const metas = (elementMeta || []).map(({ type, inputs }) => [type, getFileMetaKeys(inputs)]);
  return fromPairs(metas);
}

function getFileMetaKeys(meta) {
  return (meta || []).filter(it => it.type === 'FILE').map(it => it.key);
}

async function migrateRepositoryAssets(repository, schemaFileMeta, transaction) {
  const payload = await migrateRepository(repository, schemaFileMeta, transaction);
  return repository.update(payload, { transaction });
}

async function migrateRepositoryActivities(repositoryId, schemaFileMeta, transaction) {
  const activities = await Activity.findAll(
    { where: { repositoryId } },
    { transaction }
  );
  return Promise.each(activities, async it => {
    const payload = await migrateActivity(it, schemaFileMeta);
    return it.update(payload, { transaction });
  });
}

async function migrateRepositoryContentElements(repositoryId, schemaFileMeta, transaction) {
  const contentElements = await ContentElement.findAll(
    { where: { repositoryId } },
    { transaction }
  );
  return Promise.each(contentElements, async it => {
    const payload = await migrateContentElement(it, schemaFileMeta);
    return it.update(payload, { transaction });
  });
}

async function migrateRepositoryRevisions(repositoryId, schemaFileMeta, transaction) {
  const options = {
    where: { repositoryId, entity: { [Op.in]: REVISION_TYPES } },
    transaction
  };
  const count = await Revision.count(options);
  const pages = Math.ceil(count / CHUNK_SIZE);
  return Promise.each(
    Array.from({ length: pages }, (_, i) => i + 1),
    page => migrateRevisionsChunk({ page, options, schemaFileMeta, transaction })
  );
}

async function migrateRepository(repository, schemaFileMeta) {
  const { id, data: metaInputs } = repository;
  const metaConfigs = get(schemaFileMeta, 'repositoryMeta', []);
  const data = await migrateFileMeta(id, metaInputs, metaConfigs);
  return { data };
}

async function migrateActivity(activity, { activityTypeMetaMap }) {
  const { repositoryId, type, data: metaInputs } = activity;
  const metaConfigs = get(activityTypeMetaMap, type, []);
  const data = await migrateFileMeta(repositoryId, metaInputs, metaConfigs);
  return { data };
}

async function migrateContentElement(element, schemaFileMeta) {
  const data = await migrateContentElementData(element, schemaFileMeta);
  const meta = await migrateContentElementMeta(element, schemaFileMeta);
  return { data, meta };
}

function migrateContentElementData(element, schemaFileMeta) {
  const { type, data } = element;
  if (type === 'IMAGE') return imageMigrationHandler(element);
  if (data.embeds) return embedsMigrationHandler(element, schemaFileMeta);
  if (data.assets) return defaultMigrationHandler(element);
  return data;
}

async function migrateContentElementMeta(element, { elementTypeMetaMap }) {
  const { repositoryId, type } = element;
  const metaConfigs = get(elementTypeMetaMap, type, []);
  return migrateFileMeta(repositoryId, element.meta, metaConfigs);
}

async function migrateRevisionsChunk({ page, options, schemaFileMeta, transaction }) {
  const offset = (page - 1) * CHUNK_SIZE;
  const revisions = await Revision.findAll({
    ...options,
    offset,
    limit: CHUNK_SIZE
  });
  return Promise.each(revisions, async it => {
    const payload = await migrateRevision(it, schemaFileMeta);
    return it.update(payload, { transaction });
  });
}

async function migrateRevision(revision, schemaFileMeta) {
  const { entity, state } = revision;
  const payload = await (
    mapEntityToAction[entity] &&
    mapEntityToAction[entity](state, schemaFileMeta)
  );
  return { state: { ...state, ...payload } };
}

async function imageMigrationHandler(element) {
  const { repositoryId, data } = element;
  const repositoryAssetsPath = storage.getPath(repositoryId);
  const url = get(data, 'url');
  if (!url) return data;
  const { key, newKey } = resolveNewURL(url, repositoryAssetsPath) || {};
  if (!key || !newKey) return data;
  await storage.copyFile(key, newKey);
  return { ...element.data, url: newKey };
}

async function embedsMigrationHandler(element, schemaFileMeta) {
  const { repositoryId, data } = element;
  const embeds = await getMigratedEmbeds(repositoryId, data.embeds, schemaFileMeta);
  return { ...data, embeds };
}

function getMigratedEmbeds(repositoryId, embeds, schemaFileMeta) {
  return Promise.map(
    Object.entries(embeds),
    async ([id, embed]) => {
      const payload = await migrateContentElement({ repositoryId, ...embed }, schemaFileMeta);
      return [id, { ...embed, ...payload }];
    }
  ).reduce((acc, [id, embed]) => ({ ...acc, [id]: embed }), {});
}

async function defaultMigrationHandler(element) {
  const { repositoryId, data } = element;
  const repositoryAssetsPath = storage.getPath(repositoryId);
  const updatedAssets = await Promise
    .filter(toPairs(data.assets), ([_, value]) => value.startsWith(protocol))
    .map(async ([key, value]) => {
      const { key: oldKey, newKey } = resolveNewURL(value, repositoryAssetsPath) || {};
      if (!oldKey || !newKey) return [key, value];
      await storage.copyFile(oldKey, newKey);
      return [key, `${protocol}${newKey}`];
    });
  return {
    ...element.data,
    assets: { ...element.data.assets, ...fromPairs(updatedAssets) }
  };
}

async function migrateFileMeta(repositoryId, metaInputs, metaConfigs) {
  const repositoryAssetsPath = storage.getPath(repositoryId);
  const newMeta = await Promise.reduce(metaConfigs, async (acc, metaKey) => {
    const meta = metaInputs[metaKey];
    if (!meta) return acc;
    const url = get(meta, 'url');
    if (!url) return acc;
    const { key, newKey } = resolveNewURL(url, repositoryAssetsPath) || {};
    if (!key || !newKey) return acc;
    await storage.copyFile(key, newKey);
    return {
      ...acc,
      [metaKey]: {
        ...meta,
        key: newKey,
        url: `${protocol}${newKey}`,
        publicUrl: await storage.getFileUrl(newKey)
      }
    };
  }, {});
  return { ...metaInputs, ...newMeta };
}

function resolveNewURL(assetUrl, targetDir) {
  if (assetUrl.startsWith(protocol)) assetUrl = assetUrl.substr(protocol.length);
  const result = assetUrl.match(regex);
  if (!result) return;
  const [key, suffix] = result;
  const newKey = path.join(targetDir, suffix);
  return { key, newKey };
}
