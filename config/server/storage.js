'use strict';

module.exports = {
  amazon: {
    key: process.env.STORAGE_KEY,
    secret: process.env.STORAGE_SECRET,
    region: process.env.STORAGE_REGION,
    bucket: process.env.STORAGE_BUCKET,
    deliveryStrategy: process.env.STORAGE_DELIVERY_STRATEGY
  },
  filesystem: {
    path: process.env.STORAGE_PATH
  },
  provider: process.env.STORAGE_PROVIDER
};
