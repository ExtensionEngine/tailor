'use strict';

const autobind = require('auto-bind');
const config = require('../../../config/server').store;
const path = require('path');

class Store {
  constructor(config) {
    this.provider = Store.createProvider(config);
    autobind(this);
  }

  /**
   * @param {number} ttl - time to live measured in seconds
   */
  set(key, value, ttl) {
    return this.provider.set(key, value, ttl);
  }

  get(key) {
    return this.provider.get(key);
  }

  has(key) {
    return this.provider.has(key);
  }

  keys(pattern = '*') {
    return this.provider.keys(pattern);
  }

  delete(key) {
    return this.provider.del(key);
  }

  static createProvider(options) {
    const providerName = options.provider;
    if (!options[providerName]) {
      throw new Error('Provider should be defined in config');
    }
    const config = options[providerName];
    return loadProvider(providerName).create(config);
  }
}

module.exports = new Store(config);

function loadProvider(name) {
  try {
    return require(path.join(__dirname, './providers/', name));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') throw new Error('Unsupported provider');
    throw err;
  }
}
