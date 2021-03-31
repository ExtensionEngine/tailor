'use strict';

const autobind = require('auto-bind');
const path = require('path');

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

  getSignedCookies(resource, maxAge) {
    return this.provider.getSignedCookies(resource, maxAge);
  }

  verifyCookies(cookies, resource) {
    return this.provider.verifyCookies(cookies, resource);
  }

  hasCookies(cookies) {
    return this.provider.hasCookies(cookies);
  }

  getFileUrl(key) {
    return this.provider.getFileUrl(key);
  }

  getCookieNames() {
    return this.provider.getCookieNames();
  }
}

module.exports = Proxy;

function loadProvider(name) {
  try {
    return require(path.join(__dirname, './providers', name));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') throw new Error('Unsupported proxy provider');
    throw err;
  }
}
