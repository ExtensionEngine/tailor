'use strict';

const autobind = require('auto-bind');
const flatMap = require('lodash/flatMap');
const path = require('path');
const uniq = require('lodash/uniq');

class Proxy {
  constructor(config, storage) {
    this.storage = storage;
    this.provider = Proxy.createProvider(config);
    this.accessManagers = [this.provider.accessManager];
    autobind(this);
  }

  static createProvider(options) {
    const providerName = options.provider;
    const config = options[providerName];
    if (!config) {
      throw new Error(`Unable to find config for "${providerName}" proxy.`);
    }
    return loadProvider(options.provider).create(config);
  }

  get isSelfHosted() {
    return this.provider.isSelfHosted;
  }

  get path() {
    return this.isSelfHosted && this.provider.path;
  }

  registerAccessManager(manager) {
    this.accessManagers.push(manager);
  }

  createReadStream(key) {
    return this.storage.createReadStream(key);
  }

  getFileUrl(key) {
    return this.provider.getFileUrl(key);
  }

  createAccessManager() {
    return Object.create(this.provider.accessManager);
  }

  verifyCookies(cookies, key) {
    return this.provider.accessManager.verifyCookies(cookies, key);
  }

  getCookieNames() {
    return uniq(flatMap(this.accessManagers, 'cookies'));
  }
}

module.exports = (config, storage) => new Proxy(config, storage);

function loadProvider(name) {
  try {
    return require(path.join(__dirname, './providers', name));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') throw new Error('Unsupported proxy provider');
    throw err;
  }
}
