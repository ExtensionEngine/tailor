'use strict';

const { Revision, sequelize } = require('../shared/database');
const get = require('lodash/get');
const Promise = require('bluebird');

/**
 * This regex tries to find both possible versions of the url:
 *  - repository/assests/:content-element-id/:asset-name.ext
 *  - repository/assests/:asset-name.ext
 */
const regex = /(repository\/assets\/(\d+\/)?.+)\?/;

fixRevisionUrls()
  .then(() => {
    console.info('Fixed revision URLs.');
    process.exit(0);
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });

async function fixRevisionUrls() {
  const transaction = await sequelize.transaction();
  const revisions = await Revision.findAll({ transaction });
  await Promise.each(revisions, revision => fixUrl(revision, transaction));
  return transaction.commit();
}

function fixUrl(revision, transaction) {
  const url = get(revision, 'state.data.url');
  if (!url) return;
  const assetUrl = url.match(regex);
  if (!assetUrl) return;
  let { state } = revision;
  state = { ...state, data: { ...state.data, url: assetUrl[1] } };
  return revision.update({ state }, { transaction });
}
