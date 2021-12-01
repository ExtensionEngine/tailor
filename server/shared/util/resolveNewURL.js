'use strict';

const path = require('path');
const { protocol } = require('../../../config/server/storage');

/**
 * The regular expression matching old assets directory structure.
 * @type {RegExp}
 * @const
 * @private
 */
const OLD_ASSET_PATH_REGEX = /(?<directory>repository\/assets\/(?<fileName>[^?]*))/;

/**
 * The regular expression matching new assets directory structure.
 * @type {RegExp}
 * @const
 * @private
 */
const NEW_ASSET_PATH_REGEX = /(?<directory>repository\/\d+\/assets\/(?<fileName>[^?]*))/;

/**
 * Resolves with a new asset URL if `assetUrl` can be matched with regular expression matching old, or new, assets
 * directory structure. `undefined` value is returned in case regular expressions can't be matched or if `assetUrl`
 * contains `targetDir`, meaning they already have the same path.
 * @param {string} assetUrl The current URL of an asset.
 * @param {string} targetDir The target directory in which an asset should be stored.
 * @return {Object} An object containing old and new directory path, or an `undefined` value if `assetUrl` includes
 * `targetDir` or if `assetsUrl` can't be matched with either regular expression.
 * @public
 */
module.exports = (assetUrl, targetDir) => {
  if (assetUrl.startsWith(protocol)) assetUrl = assetUrl.slice(protocol.length);
  if (assetUrl.includes(targetDir)) return;
  const result = assetUrl.match(OLD_ASSET_PATH_REGEX) || assetUrl.match(NEW_ASSET_PATH_REGEX);
  if (!result) return;
  const { groups: { directory, fileName } } = result;
  const newKey = path.join(targetDir, fileName);
  return { key: directory, newKey };
};
