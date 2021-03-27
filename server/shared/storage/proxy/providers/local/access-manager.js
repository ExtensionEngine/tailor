'use strict';

const every = require('lodash/every');
const NodeRSA = require('node-rsa');

const storageCookies = {
  SIGNATURE: 'Storage-Signature',
  EXPIRES: 'Storage-Expires'
};

class LocalAccessManager {
  constructor(config) {
    this.signer = new NodeRSA(config.privateKey, 'private');
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

  getCookieNames() {
    return Object.values(storageCookies);
  }
}

module.exports = LocalAccessManager;

function getExpirationTime(maxAge) {
  // Expiration unix timestamp in ms
  return new Date().getTime() + maxAge;
}
