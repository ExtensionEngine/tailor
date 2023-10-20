'use strict';

const BaseProxy = require('../shared/storage/proxy');
const { proxy: config } = require('../../config/server').storage;

const RESOURCE = 'repository';

class Proxy extends BaseProxy {
  getSignedCookies(maxAge) {
    return super.getSignedCookies(RESOURCE, maxAge);
  }
}

module.exports = new Proxy(config);
