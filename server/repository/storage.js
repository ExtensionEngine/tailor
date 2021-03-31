'use strict';

const BaseStorage = require('../shared/storage');
const config = require('../../config/server').storage;
const path = require('path');

class Storage extends BaseStorage {
  getPath(repositoryId) {
    return path.join('repository', `${repositoryId}`, config.path);
  }
}

module.exports = new Storage(config);
