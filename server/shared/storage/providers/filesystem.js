'use strict';

const config = require('../../../../config/server');
const exists = require('path-exists');
const expandPath = require('untildify');
const mkdirp = require('mkdirp');
const path = require('path');
const Promise = require('bluebird');
const { validateConfig } = require('../validation');
const yup = require('yup');

const fs = Promise.promisifyAll(require('fs'));

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

  listFiles(key, options = {}) {
    return fs.readdirAsync(this.path(key), options)
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

  cleanFolder(key) {
    return this.listFiles(key).then(files => {
      if (files) return Promise.map(files, file => this.deleteFile(`${key}/${file}`));
    });
  }
}

module.exports = {
  schema,
  create: FilesystemStorage.create
};
