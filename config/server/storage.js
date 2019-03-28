'use strict';

const untildify = require('untildify');
const normalize = path => path ? untildify(path) : path;

module.exports = {
  amazon: {
    key: process.env.STORAGE_KEY,
    secret: process.env.STORAGE_SECRET,
    region: process.env.STORAGE_REGION,
    bucket: process.env.STORAGE_BUCKET
  },
  filesystem: {
    path: normalize(process.env.STORAGE_PATH)
  },
  provider: process.env.STORAGE_PROVIDER
};
