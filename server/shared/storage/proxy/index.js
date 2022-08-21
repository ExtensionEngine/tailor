import autobind from 'auto-bind';
import { fileURLToPath } from 'node:url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class Proxy {
  constructor(config) {
    this.provider = Proxy.createProvider(config);
    autobind(this);
  }

  static createProvider(options) {
    const providerName = options.provider;
    const config = options[providerName];
    if (!config) {
      throw new Error(`Unable to find config for "${providerName}" proxy.`);
    }
    return loadProvider(options.provider).create(config);
  }

  get isSelfHosted() {
    return this.provider.isSelfHosted;
  }

  get host() {
    return this.provider.host;
  }

  get path() {
    return this.isSelfHosted && this.provider.path;
  }

  getSignedCookies(resource, maxAge) {
    return this.provider.getSignedCookies(resource, maxAge);
  }

  verifyCookies(cookies, resource) {
    return this.provider.verifyCookies(cookies, resource);
  }

  hasCookies(cookies) {
    return this.provider.hasCookies(cookies);
  }

  getFileUrl(key) {
    return this.provider.getFileUrl(key);
  }

  getCookieNames() {
    return this.provider.getCookieNames();
  }
}

export default Proxy;

function loadProvider(name) {
  try {
    return import(path.join(__dirname, './providers', name));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') throw new Error('Unsupported proxy provider');
    throw err;
  }
}
