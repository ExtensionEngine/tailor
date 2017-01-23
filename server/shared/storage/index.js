const isEmpty = require('lodash/isEmpty');
const isString = require('lodash/isString');
const Amazon = require('./providers/amazon').provider;
const Local = require('./providers/local').provider;
const config = require('../../../config/server').storage;

const providerMapping = {
  amazon: {
    client: Amazon,
    config: config.amazon
  },
  local: {
    client: Local,
    config: config.local
  }
};

// TODO(marko): Write tests. Move to separate module and expose via index.js?
class Storage {
  constructor(config) {
    const providerName = Storage.validateProvider(config.provider);
    const providerData = Storage.getProviderData(providerName, providerMapping);
    const { client: ProviderClass, config: providerConfig } = providerData;

    this.provider = new ProviderClass(providerConfig);
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

  listFiles(options = {}) {
    return this.provider.listFiles(options);
  }

  getFile(options = {}) {
    return this.provider.getFile(options);
  }

  saveFile(file = '', options = {}) {
    return this.provider.saveFile(file, options);
  }

  deleteFile(options = {}) {
    return this.provider.deleteFile(options);
  }

  getFileUrl(options = {}) {
    return this.provider.getFileUrl(options);
  }

  fileExists(options = {}) {
    return this.provider.fileExists(options);
  }
}

module.exports = {
  storage: new Storage(config)
};
