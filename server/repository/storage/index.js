'use strict';

const { storage: config } = require('../../../config/server');
const path = require('path');
const serviceProvider = require('../../shared/serviceProvider');
const { Storage } = require('../../shared/storage');

class RepositoryStorage extends Storage {
  constructor(config, repositoryId) {
    super(config);
    this.repositoryId = repositoryId;
  }

  getFullKey(key) {
    return path.join('repository', `${this.repositoryId}/${key}`);
  }

  getFile(key, options = {}) {
    const fullKey = this.getFullKey(key);
    return super.getFile(fullKey, options);
  }

  createReadStream(key, options = {}) {
    const fullKey = this.getFullKey(key);
    return super.createReadStream(fullKey, options);
  }

  saveFile(key, data, options = {}) {
    const fullKey = this.getFullKey(key);
    return super.saveFile(fullKey, data, options);
  }

  createWriteStream(key, options = {}) {
    const fullKey = this.getFullKey(key);
    return super.createWriteStream(fullKey, options);
  }

  copyFile(key, newKey) {
    const fullKey = this.getFullKey(key);
    const fullNewKey = this.getFullKey(newKey);
    return super.copyFile(fullKey, fullNewKey);
  }

  moveFile(key, newKey) {
    const fullKey = this.getFullKey(key);
    const fullNewKey = this.getFullKey(newKey);
    return super.moveFile(fullKey, fullNewKey);
  }

  deleteFile(key) {
    const fullKey = this.getFullKey(key);
    return super.deleteFile(fullKey);
  }

  deleteFiles(keys) {
    const fullKeys = keys.map(key => this.getFullKey(key));
    return Promise.map(fullKeys, key => this.deleteFile(key));
  }

  listFiles(key, options = {}) {
    const fullKey = this.getFullKey(key);
    return super.listFiles(fullKey, options);
  }

  fileExists(key) {
    const fullKey = this.getFullKey(key);
    return super.fileExists(fullKey);
  }

  getFileUrl(key) {
    const fullKey = this.getFullKey(key);
    return super.getFileUrl(fullKey);
  }
}

const getRepositoryStorage = repositoryId => new RepositoryStorage(config, repositoryId);
serviceProvider.set('repositoryStorage', getRepositoryStorage);

module.exports = getRepositoryStorage;
