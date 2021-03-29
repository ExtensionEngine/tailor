'use strict';

const serviceProvider = require('../../serviceProvider');

class AccessManager {
  constructor() {
    const proxy = serviceProvider.get('storageProxy');
    this._instance = proxy.createAccessManager();
    proxy.registerAccessManager(this);
  }

  get cookies() {
    return {};
  }

  hasCookies(cookies) {
    return this._instance.hasCookies(cookies);
  }

  getSignedCookies(resource, maxAge) {
    return this._instance.getSignedCookies(resource, maxAge);
  }
}

module.exports = AccessManager;
