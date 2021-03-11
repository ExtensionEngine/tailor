'use strict';

const {
  Activity,
  ContentElement,
  Revision,
  sequelize
} = require('../shared/database');
const {
  getActivityMetadata,
  getElementMetadata,
  SCHEMAS
} = require('../../config/shared/activities');
const flatten = require('lodash/flatten');
const fromPairs = require('lodash/fromPairs');
const get = require('lodash/get');
const { getAssetsPath } = require('../shared/storage/util');
const { Op } = require('sequelize');
const Promise = require('bluebird');
const { protocol } = require('../../config/server/storage');
const storage = require('../shared/storage');
const storageProxy = require('../shared/storage/proxy');
const toPairs = require('lodash/toPairs');

const regex = /repository\/assets\/(.*)/;
const ceTypes = ['IMAGE', 'VIDEO', 'AUDIO', 'PDF', 'CAROUSEL'];
const revisionsTypes = ['CONTENT_ELEMENT', 'ACTIVITY'];
const isFunction = fn => fn && typeof fn === 'function';
const schemasIds = SCHEMAS.map(it => it.id);

const mapTypesToActions = {
  IMAGE: imageMigrationHandler,
  CAROUSEL: carouselMigrationHandler,
  DEFAULT: defaultMigrationHandler
};

const invokeAction = type => (...args) => {
  const action = mapTypesToActions[type];
  const defaultAction = mapTypesToActions.DEFAULT;
  return isFunction(action) ? action(...args) : defaultAction(...args);
};

migrate()
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
  await migrateActivities(transaction);
  await migrateContentElements(transaction);
  await migrateRevisions(transaction);
  return transaction.commit();
}

async function migrateActivities(transaction) {
  const activities = await Activity.findAll({ transaction });
  return Promise.each(activities, async it => {
    const payload = await migrateActivity(it);
    return it.update(payload, { transaction });
  });
}

async function migrateContentElements(transaction) {
  const contentElements = await ContentElement.findAll({
    where: { type: { [Op.in]: ceTypes } },
    transaction
  });
  return Promise.each(contentElements, async it => {
    const payload = await migrateContentElement(it);
    return it.update(payload, { transaction });
  });
}

async function migrateRevisions(transaction) {
  const revisions = await Revision.findAll({
    where: { entity: { [Op.in]: revisionsTypes } },
    transaction
  });
  return Promise.each(revisions, async it => {
    const payload = await migrateRevision(it);
    return it.update(payload, { transaction });
  });
}

async function migrateActivity(activity) {
  const { repositoryId, data: meta } = activity;
  const fileMetas = getActivityMetadata(activity)
    .filter(it => it.type === 'FILE')
    .map(it => it.key);
  const data = await getNewMeta(fileMetas, meta, repositoryId);
  return { data };
}

async function migrateContentElement(element) {
  const data = await migrateContentElementData(element);
  const meta = await migrateContentElementMeta(element);
  return { data, meta };
}

async function migrateRevision(revision) {
  const { entity, state } = revision;
  const payload = entity === 'CONTENT_ELEMENT'
    ? await migrateContentElement(state)
    : await migrateActivity(state);
  return { state: { ...state, ...payload } };
}

function migrateContentElementData(element) {
  return invokeAction(element.type)(element);
}

async function migrateContentElementMeta(element) {
  const { repositoryId } = element;
  const metaInputs = schemasIds
    .map(id => getElementMetadata(id, element))
    .filter(meta => !meta.isEmpty)
    .map(meta => meta.inputs);
  const fileMetas = flatten(metaInputs)
    .filter(it => it.type === 'FILE')
    .map(it => it.key);
  return getNewMeta(fileMetas, element.meta, repositoryId);
}

async function getNewMeta(fileMetas, meta, repositoryId) {
  const newMeta = await Promise.map(toPairs(meta), async it => {
    const [id, value] = it;
    if (!fileMetas.includes(id)) return it;
    const url = get(value, 'url');
    if (!url) return it;
    const { key, newKey } = getKeysFromUrl(url, repositoryId) || {};
    if (!key || !newKey) return it;
    await cpAssets(key, newKey);
    return [id, {
      ...value,
      key: newKey,
      url: `${protocol}${newKey}`,
      publicUrl: await storageProxy.getFileUrl(newKey)
    }];
  });
  return fromPairs(newMeta);
}

async function imageMigrationHandler(element) {
  const { repositoryId, data } = element;
  const url = get(data, 'url');
  if (!url) return data;
  const { key, newKey } = getKeysFromUrl(url, repositoryId) || {};
  if (!key || !newKey) return data;
  await cpAssets(key, newKey);
  return { ...element.data, url: newKey };
}

async function carouselMigrationHandler(element) {
  const { repositoryId, data } = element;
  const embeds = await Promise.map(
    Object.entries(data.embeds),
    async ([id, embed]) => {
      if (embed.type !== 'VIDEO') return [id, embed];
      const data = await defaultMigrationHandler({ repositoryId, ...embed });
      return [id, { ...embed, data }];
    })
    .reduce((acc, [id, embed]) => ({ ...acc, [id]: embed }), {});
  return { ...data, embeds };
}

async function defaultMigrationHandler(element) {
  const { repositoryId, data } = element;
  const url = get(element, 'data.assets.url');
  if (!url) return data;
  const { key, newKey } = getKeysFromUrl(url, repositoryId) || {};
  if (!key || !newKey) return data;
  await cpAssets(key, newKey);
  return {
    ...element.data,
    url: await storageProxy.getFileUrl(newKey),
    assets: { ...element.data.assets, url: `${protocol}${newKey}` }
  };
}

function getKeysFromUrl(url, repositoryId) {
  if (url.startsWith(protocol)) url = url.substr(protocol.length);
  const assetUrl = url.match(regex);
  if (!assetUrl) return;
  const [key, sufix] = assetUrl;
  const newKey = `${getAssetsPath(repositoryId)}/${sufix}`;
  return { key, newKey };
}

function cpAssets(key, newKey) {
  return storage.copyFile(key, newKey);
}
