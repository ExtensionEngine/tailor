'use strict';

const {
  Activity,
  ContentElement,
  Repository,
  Revision,
  sequelize
} = require('../shared/database');
const flatten = require('lodash/flatten');
const fromPairs = require('lodash/fromPairs');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
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
const schemasIds = SCHEMAS.map(it => it.id);

// const mapEntityToAction = {
//   REPOSITORY: migrateRepository,
//   ACTIVITY: migrateActivity,
//   CONTENT_ELEMENT: migrateContentElement
// };

const schemasMeta = getMetasFromSchema(SCHEMAS);

function getMetasFromSchema(schemas) {
  return schemas.reduce((acc, it) => {
    return {
      ...acc,
      [it.id]: {
        repository: getFileMetasKey(it.meta),
        activity: getStructureTypeMetaMap(it.structure),
        elements: getElementTypeMetaMap(it.elementMeta)
      }
    };
  }, {});
}

function getStructureTypeMetaMap(structure) {
  return fromPairs(
    structure
    .map(({ type, meta }) => [type, getFileMetasKey(meta)])
    .filter(([_, value]) => !isEmpty(value))
  );
}

function getElementTypeMetaMap(elementMeta) {
  return fromPairs(
    elementMeta
    .map(({ type, inputs }) => [type, getFileMetasKey(inputs)])
    .filter(([_, value]) => !isEmpty(value))
  );
}

function getFileMetasKey(metas) {
  return (metas || []).filter(it => it.type === 'FILE').map(it => it.key);
}

// migrate()
//   .then(({ transaction }) => transaction.commit())
//   .then(() => {
//     console.info('Migration script was executed successfully.');
//     process.exit(0);
//   })
//   .catch(error => {
//     console.error(error.message);
//     process.exit(1);
//   });

// async function migrate() {
//   const transaction = await sequelize.transaction();
//   const tasks = await getMigrationTasks(transaction);
//   return tasks.run({ transaction });
// }

// async function getMigrationTasks(transaction) {
//   const repositories = await Repository.findAll({ transaction });
//   const tasks = repositories.map(repository => ({
//     title: `Migrate repository: "${repository.name}"`,
//     task: () => getRepositoryTasks(repository, transaction)
//   }));
//   return new Listr(tasks);
// }

// async function getRepositoryTasks(repository, transaction) {
//   return new Listr([
//     {
//       title: 'Migrate repository',
//       task: () => migrateRepositoryAssets(repository, transaction)
//     },
//     {
//       title: 'Migrate activities',
//       task: () => migrateRepositoryActivities(repository.id, transaction)
//     },
//     {
//       title: 'Migrate content elements',
//       task: () => migrateRepositoryContentElements(repository.id, transaction)
//     },
//     {
//       title: 'Migrate revisions',
//       task: () => migrateRepositoryRevisions(repository.id, transaction)
//     }
//   ]);
// }

// async function migrateRepositoryAssets(repository, transaction) {
//   const payload = await migrateRepository(repository);
//   return repository.update(payload, { transaction });
// }

// async function migrateRepository(repository) {
//   const { id, data: meta } = repository;
//   const fileMetas = getRepositoryMetadata(repository)
//     .filter(it => it.type === 'FILE')
//     .map(it => it.key);
//   const data = await getNewMeta(fileMetas, meta, id);
//   return { data };
// }

// async function migrateRepositoryActivities(repositoryId, transaction) {
//   const activities = await Activity.findAll(
//     { where: { repositoryId } },
//     { transaction }
//   );
//   return Promise.each(activities, async it => {
//     const payload = await migrateActivity(it);
//     return it.update(payload, { transaction });
//   });
// }

// async function migrateRepositoryContentElements(repositoryId, transaction) {
//   const contentElements = await ContentElement.findAll(
//     { where: { repositoryId } },
//     { transaction }
//   );
//   return Promise.each(contentElements, async it => {
//     const payload = await migrateContentElement(it);
//     return it.update(payload, { transaction });
//   });
// }

// async function migrateRepositoryRevisions(repositoryId, transaction) {
//   const options = {
//     where: { repositoryId, entity: { [Op.in]: REVISION_TYPES } },
//     transaction
//   };
//   const count = await Revision.count(options);
//   const pages = Math.ceil(count / CHUNK_SIZE);
//   return Promise.each(
//     Array.from({ length: pages }, (_, i) => i + 1),
//     page => migrateRevisionsChunk({ page, options, transaction })
//   );
// }

// async function migrateRevisionsChunk({ page, options, transaction }) {
//   const offset = (page - 1) * CHUNK_SIZE;
//   const revisions = await Revision.findAll({
//     ...options,
//     offset,
//     limit: CHUNK_SIZE
//   });
//   return Promise.each(revisions, async it => {
//     const payload = await migrateRevision(it);
//     return it.update(payload, { transaction });
//   });
// }

// async function migrateActivity(activity) {
//   const { repositoryId, data: meta } = activity;
//   const fileMetas = getActivityMetadata(activity)
//     .filter(it => it.type === 'FILE')
//     .map(it => it.key);
//   const data = await getNewMeta(fileMetas, meta, repositoryId);
//   return { data };
// }

// async function migrateContentElement(element) {
//   const data = await migrateContentElementData(element);
//   const meta = await migrateContentElementMeta(element);
//   return { data, meta };
// }

// function migrateContentElementData(element) {
//   const { type, data } = element;
//   if (type === 'IMAGE') return imageMigrationHandler(element);
//   if (data.embeds) return embedsMigrationHandler(element);
//   if (data.assets) return defaultMigrationHandler(element);
//   return data;
// }

// async function migrateContentElementMeta(element) {
//   const { repositoryId } = element;
//   const metaInputs = schemasIds
//     .map(id => getElementMetadata(id, element))
//     .filter(meta => !meta.isEmpty)
//     .map(meta => meta.inputs);
//   const fileMetas = flatten(metaInputs)
//     .filter(it => it.type === 'FILE')
//     .map(it => it.key);
//   return getNewMeta(fileMetas, element.meta, repositoryId);
// }

// async function getNewMeta(fileMetas, meta, repositoryId) {
//   const repositoryAssetsDir = storage.getPath(repositoryId);
//   const newMeta = await Promise.map(toPairs(meta), async it => {
//     const [id, value] = it;
//     if (!fileMetas.includes(id)) return it;
//     const url = get(value, 'url');
//     if (!url) return it;
//     const { key, newKey } = resolveNewURL(url, repositoryAssetsDir) || {};
//     if (!key || !newKey) return it;
//     await storage.copyFile(key, newKey);
//     return [id, {
//       ...value,
//       key: newKey,
//       url: `${protocol}${newKey}`,
//       publicUrl: await storage.getFileUrl(newKey)
//     }];
//   });
//   return fromPairs(newMeta);
// }

// async function imageMigrationHandler(element) {
//   const { repositoryId, data } = element;
//   const repositoryAssetsDir = storage.getPath(repositoryId);
//   const url = get(data, 'url');
//   if (!url) return data;
//   const { key, newKey } = resolveNewURL(url, repositoryAssetsDir) || {};
//   if (!key || !newKey) return data;
//   await storage.copyFile(key, newKey);
//   return { ...element.data, url: newKey };
// }

// async function embedsMigrationHandler(element) {
//   const { repositoryId, data } = element;
//   const embeds = await getMigratedEmbeds(repositoryId, data.embeds);
//   return { ...data, embeds };
// }

// function getMigratedEmbeds(repositoryId, embeds) {
//   return Promise.map(
//     Object.entries(embeds),
//     async ([id, embed]) => {
//       const payload = await migrateContentElement({ repositoryId, ...embed });
//       return [id, { ...embed, ...payload }];
//     }
//   ).reduce((acc, [id, embed]) => ({ ...acc, [id]: embed }), {});
// }

// async function defaultMigrationHandler(element) {
//   const { repositoryId, data } = element;
//   const repositoryAssetsDir = storage.getPath(repositoryId);
//   const updatedAssets = await Promise
//     .filter(toPairs(data.assets), ([_, value]) => value.startsWith(protocol))
//     .map(async ([key, value]) => {
//       const { key: oldKey, newKey } = resolveNewURL(value, repositoryAssetsDir) || {};
//       if (!oldKey || !newKey) return [key, value];
//       await storage.copyFile(oldKey, newKey);
//       return [key, `${protocol}${newKey}`];
//     });
//   return {
//     ...element.data,
//     assets: { ...element.data.assets, ...fromPairs(updatedAssets) }
//   };
// }

// async function migrateRevision(revision) {
//   const { entity, state } = revision;
//   const payload = await (mapEntityToAction[entity] && mapEntityToAction[entity](state));
//   return { state: { ...state, ...payload } };
// }

// function resolveNewURL(assetURL, targetDir) {
//   if (assetURL.startsWith(protocol)) assetURL = assetURL.substr(protocol.length);
//   const result = assetURL.match(regex);
//   if (!result) return;
//   const [key, suffix] = result;
//   const newKey = path.join(targetDir, suffix);
//   return { key, newKey };
// }
