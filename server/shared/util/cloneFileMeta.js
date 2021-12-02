'use strict';

const get = require('lodash/get');
const Promise = require('bluebird');
const { protocol } = require('../../../config/server/storage');
const resolveAssetURL = require('./resolveAssetURL');
const storage = require('../../repository/storage');

module.exports = async (metaInputs, metaConfigs, repositoryAssetsPath) => {
  const newMeta = await Promise.reduce(metaConfigs, async (acc, metaKey) => {
    const meta = get(metaInputs, metaKey);
    if (!meta) return acc;
    const url = get(meta, 'url');
    if (!url) return acc;
    const { key, newKey } = resolveAssetURL(url, repositoryAssetsPath) || {};
    if (!key || !newKey) return acc;
    await storage.copyFile(key, newKey);
    return {
      ...acc,
      [metaKey]: {
        ...meta,
        key: newKey,
        url: `${protocol}${newKey}`
      }
    };
  }, {});
  return { ...metaInputs, ...newMeta };
};
