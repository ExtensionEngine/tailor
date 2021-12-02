'use strict';

const cloneFileMeta = require('./cloneFileMeta');
const get = require('lodash/get');
const Promise = require('bluebird');
const { protocol } = require('../../../config/server/storage');
const resolveAssetURL = require('./resolveAssetURL');
const storage = require('../../repository/storage');
const toPairs = require('lodash/toPairs');

const IMAGE_ELEMENT_TYPE = 'IMAGE';

async function embedsMigrationHandler(element, repositoryAssetsPath) {
  const { repositoryId, data } = element;
  const embeds = await Promise.reduce(Object.entries(data.embeds), async (acc, [id, embed]) => {
    const payload = await cloneContentElement({ repositoryId, ...embed }, repositoryAssetsPath);
    return { ...acc, [id]: { ...embed, ...payload } };
  }, {});
  return { embeds };
}

async function defaultMigrationHandler({ data }, repositoryAssetsPath) {
  const updatedAssets = await Promise
    .filter(toPairs(data.assets), ([_, value]) => value.startsWith(protocol))
    .reduce(async (acc, [key, value]) => {
      const { key: oldKey, newKey } = resolveAssetURL(value, repositoryAssetsPath) || {};
      if (!oldKey || !newKey) return { ...acc, [key]: value };
      await storage.copyFile(oldKey, newKey);
      return { ...acc, [key]: `${protocol}${newKey}` };
    }, {});
  return { assets: { ...data.assets, ...updatedAssets } };
}

async function imageMigrationHandler({ data }, repositoryAssetsPath) {
  const url = get(data, 'url');
  if (!url) return data;
  const { key, newKey } = resolveAssetURL(url, repositoryAssetsPath) || {};
  if (!key || !newKey) return data;
  await storage.copyFile(key, newKey);
  return { ...data, url: newKey };
}

async function migrateData(element, repositoryAssetsPath) {
  const { type, data } = element;
  if (type === IMAGE_ELEMENT_TYPE) return imageMigrationHandler(element, repositoryAssetsPath);
  const embeds = data.embeds && (await embedsMigrationHandler(element, repositoryAssetsPath));
  const assets = data.assets && (await defaultMigrationHandler(element, repositoryAssetsPath));
  return { ...data, ...embeds, ...assets };
}

async function migrateMeta(element, repositoryAssetsPath, metaByElementType) {
  const { type, meta: metaInputs } = element;
  const metaConfigs = get(metaByElementType, type, []);
  return cloneFileMeta(metaInputs, metaConfigs, repositoryAssetsPath);
}

async function cloneContentElement(element, repositoryAssetsPath, metaByElementType) {
  const data = await migrateData(element, repositoryAssetsPath);
  const meta = await migrateMeta(element, repositoryAssetsPath, metaByElementType);
  return { data, meta };
}

module.exports = cloneContentElement;
