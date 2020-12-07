'use strict';

module.exports = {
  provider: process.env.STORAGE_PROVIDER,
  path: 'repository/assets',
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
    provider: process.env.STORAGE_PROXY,
    cloudfront: {
      host: process.env.STORAGE_PROXY_HOST,
      keyPairId: process.env.STORAGE_PROXY_KEY_PAIR_ID,
      key: process.env.STORAGE_PROXY_PRIVATE_KEY
    },
    local: {
      key: process.env.STORAGE_PROXY_PRIVATE_KEY
    }
  }
};
