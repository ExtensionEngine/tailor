'use strict';

const AccessManager = require('./access-manager');
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

  get AccessManagerPrototype() {
    return AccessManager;
  }

  getFileUrl(key) {
    return urlJoin(origin, this.path, key);
  }
}

module.exports = { create: Local.create.bind(Local) };
