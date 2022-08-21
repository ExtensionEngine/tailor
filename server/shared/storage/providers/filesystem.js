import * as yup from 'yup';
import config from '../../../../config/server/index.js';
import exists from 'path-exists';
import expandPath from 'untildify';
import mkdirp from 'mkdirp';
import path from 'node:path';
import Promise from 'bluebird';
import { validateConfig } from '../validation.js';

const fs = Promise.promisifyAll(import('fs'));
const isNotFound = err => err.code === 'ENOENT';
const resolvePath = str => path.resolve(expandPath(str));

const schema = yup.object().shape({
  path: yup.string().required()
});

class FilesystemStorage {
  constructor(config) {
    config = validateConfig(config, schema);
    this.root = resolvePath(config.path);
  }

  static create(config) {
    return new FilesystemStorage(config);
  }

  path(...segments) {
    segments = [this.root, ...segments];
    return path.join(...segments);
  }

  getFile(key, options = {}) {
    return fs.readFileAsync(this.path(key), options)
      .catch(err => {
        if (isNotFound(err)) return null;
        return Promise.reject(err);
      });
  }

  createReadStream(key, options = {}) {
    return fs.createReadStream(this.path(key), options);
  }

  saveFile(key, data, options = {}) {
    const filePath = this.path(key);
    return mkdirp(path.dirname(filePath))
      .then(() => fs.writeFileAsync(filePath, data, options));
  }

  createWriteStream(key, options = {}) {
    const filepath = this.path(key);
    const dirname = path.dirname(filepath);
    // TODO: Replace with async mkdir
    fs.mkdirSync(dirname, { recursive: true });
    return fs.createWriteStream(filepath, options);
  }

  copyFile(key, newKey) {
    const src = this.path(key);
    const dest = this.path(newKey);
    return mkdirp(path.dirname(dest))
      .then(() => fs.copyFileAsync(src, dest));
  }

  moveFile(key, newKey) {
    return this.copyFile(key, newKey)
      .then(file => this.deleteFile(key).then(() => file));
  }

  deleteFile(key) {
    return fs.unlinkAsync(this.path(key));
  }

  deleteFiles(keys) {
    return Promise.map(keys, key => this.deleteFile(key));
  }

  listFiles(key, options = {}) {
    return fs.readdirAsync(this.path(key), options)
      .map(fileName => `${key}/${fileName}`)
      .catch(err => {
        if (isNotFound(err)) return null;
        return Promise.reject(err);
      });
  }

  fileExists(key) {
    return exists(this.path(key));
  }

  getFileUrl(key) {
    return Promise.resolve(`${config.origin}/${key}`);
  }
}

export default {
  schema,
  create: FilesystemStorage.create
};
