import autobind from 'auto-bind';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class Proxy {
  constructor(provider) {
    this.provider = provider;
    autobind(this);
  }

  static async create(config) {
    const provider = await Proxy.createProvider(config);
    return new this(provider);
  }

  static async createProvider(options) {
    const providerName = options.provider;
    const config = options[providerName];
    if (!config) {
      throw new Error(`Unable to find config for "${providerName}" proxy.`);
    }
    const Provider = await loadProvider(options.provider);
    return Provider.create(config);
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

async function loadProvider(name) {
  try {
    const Provider = await import(path.join(__dirname, './providers', `${name}.js`));
    return Provider;
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') throw new Error('Unsupported proxy provider');
    throw err;
  }
}
