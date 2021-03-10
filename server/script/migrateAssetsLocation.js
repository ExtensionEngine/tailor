'use strict';

const { ContentElement, sequelize } = require('../shared/database');
const { getElementMetadata, SCHEMAS } = require('../../config/shared/activities');
const flatten = require('lodash/flatten');
const fromPairs = require('lodash/fromPairs');
const get = require('lodash/get');
const { getAssetsPath } = require('../shared/storage/util');
const { Op } = require('sequelize');
const Promise = require('bluebird');
const { protocol } = require('../../config/server/storage');
const storage = require('../shared/storage');
const toPairs = require('lodash/toPairs');

const regex = /repository\/assets\/(.*)/;
const types = ['IMAGE', 'VIDEO', 'AUDIO', 'PDF', 'CAROUSEL'];
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

migrateContentElements()
  .then(() => {
    console.info('Migrated content elements.');
    process.exit(0);
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });

async function migrateContentElements() {
  const transaction = await sequelize.transaction();
  const contentElements = await ContentElement.findAll({
    where: { type: { [Op.in]: types } },
    transaction
  });
  await Promise.each(contentElements, async it => {
    const payload = await migrateContentElement(it);
    return it.update(payload, { transaction });
  });
  return transaction.commit();
}

async function migrateContentElement(element) {
  const data = await migrateContentElementData(element);
  const meta = await migrateContentElementMeta(element);
  return { data, meta };
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
  const meta = await Promise.map(toPairs(element.meta), async it => {
    const [id, value] = it;
    if (!fileMetas.includes(id)) return it;
    const { url } = value;
    if (!url) return it;
    const { key, newKey } = getKeysFromUrl(url, repositoryId) || {};
    if (!key || !newKey) return it;
    await cpAssets(key, newKey);
    return [id, {
      ...value,
      key: newKey,
      url: `${protocol}${newKey}`,
      publicUrl: await storage.getFileUrl(newKey)
    }];
  });
  return fromPairs(meta);
}

async function imageMigrationHandler(element) {
  const { repositoryId, data: { url } } = element;
  if (!url) return;
  const { key, newKey } = getKeysFromUrl(url, repositoryId) || {};
  if (!key || !newKey) return;
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
  const { repositoryId } = element;
  const url = get(element, 'data.assets.url');
  if (!url) return;
  const { key, newKey } = getKeysFromUrl(url, repositoryId) || {};
  if (!key || !newKey) return;
  await cpAssets(key, newKey);
  return {
    ...element.data,
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
