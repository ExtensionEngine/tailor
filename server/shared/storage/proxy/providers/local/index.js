'use strict';

const AccessManager = require('./AccessManager');
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
    config = validateConfig(config, schema);
    this.accessManager = new AccessManager(config);
    this.isSelfHosted = true;
    this.path = PROXY_PATH;
  }

  static create(config) {
    return new this(config);
  }

  getFileUrl(key) {
    return urlJoin(origin, this.path, key);
  }
}

module.exports = { create: Local.create.bind(Local) };
