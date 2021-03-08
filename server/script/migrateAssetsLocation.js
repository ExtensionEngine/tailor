'use strict';

const { ContentElement } = require('../shared/database');
const { getAssetsPath } = require('../shared/storage/util');
const { Op } = require('sequelize');
const Promise = require('bluebird');
const storage = require('../shared/storage');

const regex = /repository\/assets\/(\d*)\/(.*)?/;
const types = ['IMAGE', 'VIDEO', 'AUDIO', 'PDF', 'SCORM'];

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
  SCORM: scormMigrationHandler
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

function imageMigrationHandler(element) {
  const { url, repositoryId } = element;
  if (!url) return;
  const result = url.match(regex);
  if (!result) return;
  const [, id, fileName] = result;
  const newPath = `${getAssetsPath(repositoryId)}/${id}/${fileName}`;
  return cpAssets(url, newPath);
}

function defaultMigrationHandler(element) {}

function scormMigrationHandler(element) {}

function cpAssets(oldPath, newPath) {
  return storage.copyFile(oldPath, newPath);
}

// function migrateRevisions() {}
