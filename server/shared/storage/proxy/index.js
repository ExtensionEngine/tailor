'use strict';

const autobind = require('auto-bind');
const { proxy: config } = require('../../../../config/server').storage;
const path = require('path');

const storageCookies = {
  REPOSITORY: 'Storage-Repository'
};

class Proxy {
  constructor(config) {
    this.provider = Proxy.createProvider(config);
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

  getSignedCookies(baseUrl, repositoryId, maxAge) {
    const resource = `${baseUrl}/${repositoryId}`;
    return {
      ...this.provider.getSignedCookies(resource, maxAge),
      [storageCookies.REPOSITORY]: repositoryId
    };
  }

  verifyCookies(cookies, resource) {
    return this.provider.verifyCookies(cookies, resource);
  }

  hasCookies(cookies, repositoryId) {
    const { REPOSITORY } = storageCookies;
    const isRepositoryId = cookies[REPOSITORY] === repositoryId.toString();
    return isRepositoryId && this.provider.hasCookies(cookies);
  }

  getFileUrl(key) {
    return this.provider.getFileUrl(key);
  }
}

module.exports = new Proxy(config);

function loadProvider(name) {
  try {
    return require(path.join(__dirname, './providers', name));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') throw new Error('Unsupported proxy provider');
    throw err;
  }
}
