'use strict';

const every = require('lodash/every');
const NodeRSA = require('node-rsa');
const { origin } = require('../../../../../config/server');
const urlJoin = require('url-join');
const { validateConfig } = require('../../validation');
const yup = require('yup');

const PROXY_PATH = '/proxy';
const storageCookies = {
  SIGNATURE: 'Storage-Signature',
  EXPIRES: 'Storage-Expires'
};

const schema = yup.object().shape({
  privateKey: yup.string().pkcs1().required()
});

class Local {
  constructor(config) {
    config = validateConfig(config, schema);

    this.signer = new NodeRSA(config.privateKey, 'private');
    this.isSelfHosted = true;
    this.path = PROXY_PATH;
  }

  static create(config) {
    return new this(config);
  }

  getSignedCookies(resource, maxAge) {
    const expires = getExpirationTime(maxAge);
    const signature = this.signer.encrypt({ resource, expires }, 'base64');
    return {
      [storageCookies.SIGNATURE]: signature,
      [storageCookies.EXPIRES]: expires
    };
  }

  verifyCookies(cookies, key) {
    const signatureCookie = cookies[storageCookies.SIGNATURE];
    const expiresCookie = Number(cookies[storageCookies.EXPIRES]);
    if (!signatureCookie || !expiresCookie) return false;
    const { resource, expires } = this.signer.decrypt(signatureCookie, 'json');
    const isExpired = expiresCookie !== expires || expires < new Date().getTime();
    return !isExpired && key.startsWith(resource);
  }

  hasCookies(cookies) {
    return every(storageCookies, cookie => cookies[cookie]);
  }

  getFileUrl(key) {
    return urlJoin(origin, this.path, key);
  }

  getCookieNames() {
    return Object.values(storageCookies);
  }
}

module.exports = { create: Local.create.bind(Local) };

function getExpirationTime(maxAge) {
  // Expiration unix timestamp in ms
  return new Date().getTime() + maxAge;
}
