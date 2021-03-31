'use strict';

const autobind = require('auto-bind');
const path = require('path');

class Storage {
  constructor(config, { isPublic = false } = {}) {
    this.provider = Storage.createProvider(config);
    this.isPublic = isPublic;
    autobind(this);
  }

  getFile(key, options = {}) {
    return this.provider.getFile(key, options);
  }

  createReadStream(key, options = {}) {
    return this.provider.createReadStream(key, options);
  }

  saveFile(key, data, options = {}) {
    return this.provider.saveFile(key, data, options);
  }

  createWriteStream(key, options = {}) {
    return this.provider.createWriteStream(key, options);
  }

  deleteFile(key, options = {}) {
    return this.provider.deleteFile(key, options);
  }

  deleteFiles(keys, options = {}) {
    return this.provider.deleteFiles(keys, options);
  }

  listFiles(options = {}) {
    return this.provider.listFiles(options);
  }

  fileExists(key, options = {}) {
    return this.provider.fileExists(key, options);
  }

  getFileUrl(key, options = {}) {
    return this.provider.getFileUrl(key, options);
  }

  moveFile(key, newKey, options = {}) {
    return this.provider.moveFile(key, newKey, options);
  }

  copyFile(key, newKey, options = {}) {
    return this.provider.copyFile(key, newKey, options);
  }

  static createProvider(options) {
    // Validate provider name.
    const providerName = options.provider;
    if (!options[providerName]) {
      throw new Error('Provider should be defined in config');
    }

    // Load provider module & create provider instance.
    const config = options[providerName];
    return loadProvider(providerName).create(config);
  }
}

module.exports = (config, options) => new Storage(config, options);
module.exports.Storage = Storage;

function loadProvider(name) {
  try {
    return require(path.join(__dirname, './providers/', name));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') throw new Error('Unsupported provider');
    throw err;
  }
}
