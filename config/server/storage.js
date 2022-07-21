'use strict';

const isBase64 = require('is-base64');
const { STORAGE_PROXY_PRIVATE_KEY } = process.env;

const parseB64 = val => Buffer.from(val, 'base64').toString('utf8');

const PROXY_PRIVATE_KEY = STORAGE_PROXY_PRIVATE_KEY && isBase64(STORAGE_PROXY_PRIVATE_KEY)
  ? parseB64(STORAGE_PROXY_PRIVATE_KEY)
  : STORAGE_PROXY_PRIVATE_KEY;

module.exports = {
  provider: process.env.STORAGE_PROVIDER,
  // The path where assets will be stored inside repository/${repositoryId} folder.
  // For example, if path is equal to assets,
  // assets will be stored inside repository/${repositoryId}/assets folder
  path: 'assets',
  protocol: 'storage://',
  amazon: {
    key: process.env.STORAGE_KEY,
    secret: process.env.STORAGE_SECRET,
    region: process.env.STORAGE_REGION,
    bucket: process.env.STORAGE_BUCKET
  },
  filesystem: {
    path: process.env.STORAGE_PATH
  },
  proxy: {
    provider: process.env.STORAGE_PROXY || 'local',
    cloudfront: {
      host: process.env.STORAGE_PROXY_HOST,
      keyPairId: process.env.STORAGE_PROXY_KEY_PAIR_ID,
      privateKey: process.env.STORAGE_PROXY_PRIVATE_KEY
    },
    local: {
      privateKey: PROXY_PRIVATE_KEY
    }
  }
};
