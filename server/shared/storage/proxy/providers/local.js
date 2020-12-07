'use strict';

const NodeRSA = require('node-rsa');
const { origin } = require('../../../../../config/server');
const urlJoin = require('url-join');
const { validateConfig } = require('../../validation');
const yup = require('yup');

const PROXY_PATH = '/proxy';
const storageCookies = { SIGNATURE: 'Storage-Signature' };

const schema = yup.object().shape({
  key: yup.string().required()
});

class Local {
  constructor(config) {
    config = validateConfig(config, schema);

    this.signer = new NodeRSA(config.key);
    this.isSelfHosted = true;
    this.path = PROXY_PATH;
  }

  static create(config) {
    return new this(config);
  }

  getSignedCookies(resource) {
    const signature = this.signer.encrypt(resource, 'base64');
    return { [storageCookies.SIGNATURE]: signature };
  }

  verifyCookies(cookies, resource) {
    const signature = cookies[storageCookies.SIGNATURE];
    if (!signature) return false;
    const allowedResource = this.signer.decrypt(signature, 'utf8');
    return resource.startsWith(allowedResource);
  }

  hasCookies(cookies) {
    return Object.keys(storageCookies)
      .reduce((hasCookies, cookie) => cookies[cookie] || hasCookies, false);
  }

  getFileUrl(key) {
    return urlJoin(origin, this.path, key);
  }
}

module.exports = { create: Local.create.bind(Local) };
