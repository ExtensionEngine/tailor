'use strict';

const every = require('lodash/every');
const { Signer } = require('aws-sdk/clients/cloudfront');
const urlJoin = require('url-join');
const { validateConfig } = require('../../validation');
const yup = require('yup');

const storageCookies = {
  SIGNATURE: 'CloudFront-Signature',
  POLICY: 'CloudFront-Policy',
  KEY_PAIR_ID: 'CloudFront-Key-Pair-Id'
};

const schema = yup.object().shape({
  privateKey: yup.string().pkcs1().required(),
  keyPairId: yup.string().required(),
  host: yup.string().required()
});

class CloudFront {
  constructor(config) {
    config = validateConfig(config, schema);

    this.signer = new Signer(config.keyPairId, config.privateKey);
    this.host = config.host;
  }

  static create(config) {
    return new this(config);
  }

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront/Signer.html#getSignedCookie-property
  getSignedCookies(path, maxAge) {
    const expires = getExpirationTime(maxAge);
    const resource = urlJoin(this.host, path, '*');
    const policy = createPolicy(resource, expires);
    return this.signer.getSignedCookie({ policy });
  }

  verifyCookies() {
    throw new Error('Provider does not support cookie verification.');
  }

  hasCookies(cookies) {
    return every(storageCookies, cookie => cookies[cookie]);
  }

  getFileUrl(key) {
    return urlJoin(this.host, key);
  }

  getCookieNames() {
    return Object.values(storageCookies);
  }
}

module.exports = { create: CloudFront.create.bind(CloudFront) };

function createPolicy(resource, expires) {
  return JSON.stringify({
    Statement: [{
      Resource: resource,
      Condition: {
        DateLessThan: { 'AWS:EpochTime': expires }
      }
    }]
  });
}

function getExpirationTime(maxAge) {
  // Expiration unix timestamp in seconds
  return Math.floor(new Date().getTime() + maxAge / 1000);
}
