'use strict';

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
  }
};
