'use strict';

const AccessManager = require('./access-manager');
const last = require('lodash/last');
const { origin } = require('../../../../../../config/server');
const urlJoin = require('url-join');
const { validateConfig } = require('../../../validation');
const yup = require('yup');

const PROXY_PATH = '/proxy';

const schema = yup.object().shape({
  privateKey: yup.string().pkcs1().required()
});

class Local {
  constructor(config) {
    this.config = validateConfig(config, schema);
    this.accessManager = new AccessManager(this.config);
    this.isSelfHosted = true;
    this.path = PROXY_PATH;
  }

  static create(config) {
    return new this(config);
  }

  get AccessManager() {
    return AccessManager;
  }

  getSignedCookies(resource, maxAge, accessManager = this.accessManager) {
    const expires = getExpirationTime(maxAge);
    return accessManager.getSignedCookies(resource, expires);
  }

  verifyCookies(cookies, key, accessManager = this.accessManager) {
    return accessManager.verifyCookies(cookies, key);
  }

  hasCookies(cookies, ...params) {
    const accessManager = last(params) || this.accessManager;
    return accessManager.hasCookies(cookies, ...params);
  }

  getCookieNames(accessManager = this.accessManager) {
    return accessManager.getCookieNames();
  }

  getFileUrl(key) {
    return urlJoin(origin, this.path, key);
  }
}

module.exports = { create: Local.create.bind(Local) };

function getExpirationTime(maxAge) {
  // Expiration unix timestamp in ms
  return new Date().getTime() + maxAge;
}
