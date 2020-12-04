'use strict';

const { Signer } = require('aws-sdk/clients/cloudfront');
const urlJoin = require('url-join');

const storageCookies = {
  SIGNATURE: 'CloudFront-Signature',
  EXPIRE: 'CloudFront-Expire',
  KEY_PAIR_ID: 'CloudFront-Key-Pair-Id'
};

class CloudFront {
  constructor(config) {
    this.signer = new Signer(config.keyPairId, config.key);
    this.host = config.host;
  }

  static create(config) {
    return new this(config);
  }

  getSignedCookies() {
    const expires = getExpirationTime();
    return this.signer.getSignedCookie({ url: this.host, expires });
  }

  verifyCookies() {
    throw new Error('Provider does not support cookie verification.');
  }

  hasCookies(cookies) {
    return Object.keys(storageCookies)
      .reduce((hasCookies, cookie) => cookies[cookie] || hasCookies, false);
  }

  getFileUrl(key) {
    return urlJoin(this.host, key);
  }
}

module.exports = { create: CloudFront.create.bind(CloudFront) };

function getExpirationTime() {
  return Math.floor(new Date().getTime() / 1000) + 60 * 60 * 1;
}
