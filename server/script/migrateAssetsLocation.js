'use strict';

const { ContentElement, sequelize } = require('../shared/database');
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
  const transaction = await sequelize.transaction();
  const contentElements = await ContentElement.findAll({
    where: { type: { [Op.in]: types } },
    transaction
  });
  await Promise.each(
    contentElements,
    it => mapTypesToActions[it.type] && mapTypesToActions[it.type](it, transaction)
  );
  return transaction.commit();
}

async function imageMigrationHandler(element, transaction) {
  const { repositoryId, data: { url } } = element;
  if (!url) return;
  const { key, newKey } = getKeysFromUrl(url, repositoryId) || {};
  if (!key || !newKey) return;
  await cpAssets(key, newKey);
  return element.update({ data: { ...element.data, url: newKey } }, { transaction });
}

async function defaultMigrationHandler(element, transaction) {
  const { repositoryId } = element;
  const url = get(element, 'data.assets.url');
  if (!url) return;
  const { key, newKey } = getKeysFromUrl(url, repositoryId) || {};
  if (!key || !newKey) return;
  await cpAssets(key, newKey);
  const data = {
    ...element.data,
    assets: { ...element.data.assets, url: `${protocol}${newKey}` }
  };
  return element.update({ data }, { transaction });
}

function carouselMigrationHandler(element, transaction) {
  const { repositoryId, data: { embeds } } = element;
  return Promise.all(Object.entries(embeds).map(async ([id, el]) => {
    if (el.type !== 'VIDEO') return;
    const url = get(el, 'data.assets.url');
    if (!url) return;
    const { key, newKey } = getKeysFromUrl(url, repositoryId) || {};
    if (!key || !newKey) return;
    await cpAssets(key, newKey);
    const newElement = {
      ...el,
      data: {
        ...el.data,
        assets: { ...el.data.assets, url: `${protocol}${newKey}` }
      }
    };
    return element.update({
      data: {
        ...element.data,
        embeds: {
          ...element.data.embeds,
          [id]: newElement
        }
      }
    }, { transaction });
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
