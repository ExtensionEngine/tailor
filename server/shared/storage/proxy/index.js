'use strict';

const autobind = require('auto-bind');
const { proxy: config } = require('../../../../config/server').storage;
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
      throw new Error(`Unable to find config for "${config.provider}" proxy.`);
    }
    return loadProvider(options.provider).create(config);
  }

  get isSelfHosted() {
    return this.provider.isSelfHosted;
  }

  getSignedCookies() {
    return this.provider.getSignedCookies();
  }

  verifyCookies(cookies) {
    return this.provider.verifyCookies(cookies);
  }

  hasCookies(cookies) {
    return this.provider.hasCookies(cookies);
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
