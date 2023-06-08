import 'dotenv/config';
import createLogger from '../shared/logger.js';
import get from 'lodash/get.js';
import Promise from 'bluebird';

createLogger.enabled = false;

// Dynamic import is needed in order for the `enabled` flag to be respected
const { default: db } = await import('../shared/database/index.js');

const { Revision, sequelize } = db;

/**
 * This regex tries to find both possible versions of the url:
 *  - `repository/assests/:content-element-id/:asset-name.ext`
 *  - `repository/assests/:asset-name.ext`
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
