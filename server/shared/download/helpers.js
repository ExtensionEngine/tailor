'use strict';
const { uniq } = require('lodash');
const Promise = require('bluebird');
const rmdir = Promise.promisify(require('rimraf'));
const Storage = require('../storage');
const tar = require('tar');

class ArchiveStorage extends Storage {
  constructor(config) {
    super(config);
    this._writtenFiles = [];
  }
  saveFile(key, data, options = {}) {
    this._writtenFiles.push(key.split('/').pop());
    return super.saveFile(key, data, options);
  }
  deleteFolder(key) {
    return rmdir(key);
  }
  zipFiles(courseId, path) {
    const key = `${path}/repository/${courseId}`;
    this._writtenFiles = uniq(this._writtenFiles);
    return tar.c(
      {
        gzip: true,
        C: key,
        file: `${key}.tgz`
      },
      this._writtenFiles);
  }
}

module.exports = {
  ArchiveStorage
};
