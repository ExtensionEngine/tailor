'use strict';

const autobind = require('auto-bind');
const flatMap = require('lodash/flatMap');
const path = require('path');
const uniq = require('lodash/uniq');

class Proxy {
  constructor(config) {
    this.storages = {};
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

  addStorage(path, storage) {
    const existing = this.storages[path];
    if (existing) throw new Error(`Storage is already mounted on ${path} path.`);
    this.storages[path] = storage;
  }

  registerAccessManager(manager) {
    this.accessManagers.push(manager);
  }

  getStorage(key) {
    const path = Object.keys(this.storages)
      .sort(compareStringsByLengthDesc)
      .find(path => key.startsWith(path));

    return path && this.storages[path];
  }

  createReadStream(key) {
    const storage = this.getStorage(key);
    return storage.createReadStream(key);
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

function compareStringsByLengthDesc(fst, sec) {
  return sec.length - fst.length;
}
