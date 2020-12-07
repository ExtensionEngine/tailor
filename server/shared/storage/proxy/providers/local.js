'use strict';

const NodeRSA = require('node-rsa');
const { origin } = require('../../../../../config/server');
const urlJoin = require('url-join');
const { validateConfig } = require('../../validation');
const yup = require('yup');

const storageCookies = {
  SIGNATURE: 'Storage-Signature'
};
const PROXY_PATH = '/proxy';

const schema = yup.object().shape({
  key: yup.string().required()
});

class Local {
  constructor(config) {
    config = validateConfig(config, schema);

    this.signer = new NodeRSA(config.key);
    this.path = PROXY_PATH;
    this.origin = urlJoin(origin, PROXY_PATH);
    this.isSelfHosted = true;
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
    return urlJoin(this.origin, key);
  }
}

module.exports = { create: Local.create.bind(Local) };

function getExpirationTime(maxAge) {
  // Expiration unix timestamp in ms
  return new Date().getTime() + maxAge;
}
