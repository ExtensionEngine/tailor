'use strict';

const NodeRSA = require('node-rsa');
const { origin } = require('../../../../../config/server');
const urlJoin = require('url-join');

const storageCookies = {
  SIGNATURE: 'Storage-Signature',
  EXPIRES: 'Storage-Expires'
};

class Local {
  constructor(config) {
    this.signer = new NodeRSA(config.key);
    this.path = '/proxy';
    this.isSelfHosted = true;
  }

  static create(config) {
    return new this(config);
  }

  get host() {
    return urlJoin(origin, this.path);
  }

  getSignedCookies() {
    const expires = getExpirationTime();
    const signature = this.signer.sign(this.host, 'base64');
    return {
      [storageCookies.SIGNATURE]: signature,
      [storageCookies.EXPIRES]: expires
    };
  }

  verifyCookies(cookies) {
    const signature = cookies[storageCookies.SIGNATURE];
    return signature && this.signer.verify(this.host, signature, 'utf8', 'base64');
  }

  hasCookies(cookies) {
    return Object.keys(storageCookies)
      .reduce((hasCookies, cookie) => cookies[cookie] || hasCookies, false);
  }

  getFileUrl(key) {
    return urlJoin(this.host, key);
  }
}

module.exports = { create: Local.create.bind(Local) };

function getExpirationTime() {
  return Math.floor(new Date().getTime() / 1000) + 60 * 60 * 1;
}
