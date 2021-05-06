'use strict';

module.exports = {
  provider: process.env.STORAGE_PROVIDER,
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
      privateKey: process.env.STORAGE_PROXY_PRIVATE_KEY
    }
  }
};
