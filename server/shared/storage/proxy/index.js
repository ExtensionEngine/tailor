'use strict';

const autobind = require('auto-bind');
const path = require('path');
const { proxy: config } = require('../../../../config/server').storage;

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

  get config() {
    return this.provider.config;
  }

  get path() {
    return this.isSelfHosted && this.provider.path;
  }

  get AccessManager() {
    return this.provider.AccessManager;
  }

  getSignedCookies(resource, maxAge, accessManager) {
    return this.provider.getSignedCookies(resource, maxAge, accessManager);
  }

  verifyCookies(cookies, resource, accessManager) {
    return this.provider.verifyCookies(cookies, resource, accessManager);
  }

  hasCookies(cookies, ...params) {
    return this.provider.hasCookies(cookies, ...params);
  }

  getFileUrl(key) {
    return this.provider.getFileUrl(key);
  }

  getCookieNames(accessManager) {
    return this.provider.getCookieNames(accessManager);
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
