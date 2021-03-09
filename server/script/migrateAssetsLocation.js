'use strict';

const cloneDeep = require('lodash/cloneDeep');
const { ContentElement } = require('../shared/database');
const get = require('lodash/get');
const { getAssetsPath } = require('../shared/storage/util');
const { Op } = require('sequelize');
const Promise = require('bluebird');
const { protocol } = require('../../config/server/storage');
const storage = require('../shared/storage');

const regex = /repository\/assets\/(.*)/;
const types = ['IMAGE', 'VIDEO', 'AUDIO', 'PDF', 'CAROUSEL'];

migrateContentElement()
  .then(() => {
    console.info('Migrated content elements.');
    process.exit(0);
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });

const mapTypesToActions = {
  IMAGE: imageMigrationHandler,
  VIDEO: defaultMigrationHandler,
  AUDIO: defaultMigrationHandler,
  PDF: defaultMigrationHandler,
  CAROUSEL: carouselMigrationHandler
};

async function migrateContentElement() {
  const contentElements = await ContentElement.findAll({
    where: { type: { [Op.in]: types } }
  });
  return Promise.each(
    contentElements,
    it => mapTypesToActions[it.type] && mapTypesToActions[it.type](it)
  );
}

async function imageMigrationHandler(element) {
  const { repositoryId, data: { url } } = element;
  if (!url) return;
  const { key, newKey } = getKeysFromUrl(url, repositoryId) || {};
  if (!key || !newKey) return;
  await cpAssets(key, newKey);
  return element.update({ ...element, data: { ...element.data, url: newKey } });
}

async function defaultMigrationHandler(element) {
  const { repositoryId, data } = element;
  const url = get(data, 'assets.url');
  if (!url) return;
  const { key, newKey } = getKeysFromUrl(url, repositoryId) || {};
  if (!key || !newKey) return;
  await cpAssets(key, newKey);
  const newElement = cloneDeep(element);
  Object.assign(newElement.data.assets, { url: `${protocol}${newKey}` });
  return element.update(newElement);
}

function carouselMigrationHandler(element) {
  const { repositoryId, data: { embeds } } = element;
  return Promise.all(Object.entries(embeds).map(async ([id, el]) => {
    if (el.type !== 'VIDEO') return;
    const url = get(el, 'data.assets.url');
    if (!url) return;
    const { key, newKey } = getKeysFromUrl(url, repositoryId) || {};
    if (!key || !newKey) return;
    await cpAssets(key, newKey);
    const newElement = cloneDeep(el);
    Object.assign(newElement.data.assets, { url: `${protocol}${newKey}` });
    return element.update({
      ...element,
      data: {
        ...element.data,
        embeds: {
          ...element.data.embeds,
          [id]: newElement
        }
      }
    });
  }));
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
