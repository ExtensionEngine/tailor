const isEmpty = require('lodash/isEmpty');
const isString = require('lodash/isString');
const Amazon = require('./providers/amazon').provider;
const config = require('../../../config/server').storage;

const providerMapping = {
  amazon: {
    client: Amazon,
    config: config.amazon
  }
};

// TODO(marko): Write tests. Move to separate module and expose via index.js?
class Storage {
  constructor(config) {
    const providerName = Storage.validateProvider(config.provider);
    const providerData = Storage.getProviderData(providerName, providerMapping);
    const { client: ProviderClass, config: providerConfig } = providerData;

    this.provider = new ProviderClass(providerConfig);

    this.getFile = this.getFile.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.listFiles = this.listFiles.bind(this);
    this.getFileUrl = this.getFileUrl.bind(this);
    this.fileExists = this.fileExists.bind(this);
    this.moveFile = this.moveFile.bind(this);
  }

  static validateProvider(provider) {
    if (!isString(provider || !isEmpty(provider))) {
      throw Error('Provider should be defined in config');
    }

    return provider;
  }

  /**
   * @description Validates wether provider data exists in provider mapping,
   * based on provider name. Throws error if not.
   *
   * @param {string} name Name of the storage provider.
   * @param {object} mapping Object containing provider config and class.
   * @return {object} Return provider class and provider config.
   */
  static getProviderData(name, mapping) {
    const { config, client } = mapping[name];
    if (!config || !client) throw Error('Provider is not supported');
    return { client, config };
  }

  getFile(key, options = {}) {
    return this.provider.getFile(key, options);
  }

  saveFile(key, file, options = {}) {
    return this.provider.saveFile(key, file, options);
  }

  deleteFile(key, options = {}) {
    return this.provider.deleteFile(key, options);
  }

  listFiles(options = {}) {
    return this.provider.listFiles(options);
  }

  getFileUrl(key, options = {}) {
    return this.provider.getFileUrl(key, options);
  }

  fileExists(key, options = {}) {
    return this.provider.fileExists(key, options);
  }

  moveFile(key, newKey, options = {}) {
    return this.provider.moveFile(key, newKey, options);
  }
}

module.exports = new Storage(config);
