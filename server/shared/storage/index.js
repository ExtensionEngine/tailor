import autobind from 'auto-bind';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class Storage {
  constructor(provider) {
    this.provider = provider;
    autobind(this);
  }

  getFile(key, options = {}) {
    return this.provider.getFile(key, options);
  }

  createReadStream(key, options = {}) {
    return this.provider.createReadStream(key, options);
  }

  saveFile(key, data, options = {}) {
    return this.provider.saveFile(key, data, options);
  }

  createWriteStream(key, options = {}) {
    return this.provider.createWriteStream(key, options);
  }

  deleteFile(key, options = {}) {
    return this.provider.deleteFile(key, options);
  }

  deleteFiles(keys, options = {}) {
    return this.provider.deleteFiles(keys, options);
  }

  listFiles(options = {}) {
    return this.provider.listFiles(options);
  }

  fileExists(key, options = {}) {
    return this.provider.fileExists(key, options);
  }

  getFileUrl(key, options = {}) {
    return this.provider.getFileUrl(key, options);
  }

  moveFile(key, newKey, options = {}) {
    return this.provider.moveFile(key, newKey, options);
  }

  copyFile(key, newKey, options = {}) {
    return this.provider.copyFile(key, newKey, options);
  }

  static async create(config) {
    const provider = await Storage.createProvider(config);
    return new this(provider);
  }

  static async createProvider(options) {
    // Validate provider name.
    const providerName = options.provider;
    if (!options[providerName]) {
      throw new Error('Provider should be defined in config');
    }

    // Load provider module & create provider instance.
    const config = options[providerName];
    const Provider = await loadProvider(providerName);
    return Provider.create(config);
  }
}

export default Storage;

async function loadProvider(name) {
  try {
    const Provider = await import(path.join(__dirname, './providers/', `${name}.js`));
    return Provider;
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') throw new Error('Unsupported provider');
    throw err;
  }
}
