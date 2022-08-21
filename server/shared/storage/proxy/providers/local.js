import * as yup from 'yup';
import every from 'lodash/every';
import NodeRSA from 'node-rsa';
import { origin } from '../../../../../config/server/index.js';
import urlJoin from 'url-join';
import { validateConfig } from '../../validation.js';

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
    this.host = urlJoin(origin, this.path);
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
    return urlJoin(this.host, key);
  }

  getCookieNames() {
    return Object.values(storageCookies);
  }
}

export default { create: Local.create.bind(Local) };

function getExpirationTime(maxAge) {
  // Expiration unix timestamp in ms
  return new Date().getTime() + maxAge;
}
