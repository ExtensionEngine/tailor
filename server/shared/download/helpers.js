'use strict';

const { Storage } = require('../storage');
const tar = require('tar');
const uniq = require('lodash/uniq');

class ArchiveStorage extends Storage {
  constructor(config) {
    super(config);
    this._writtenFiles = [];
  }
  saveFile(key, data, options = {}) {
    this._writtenFiles.push(key.split('/').pop());
    return super.saveFile(key, data, options);
  }

  archiveContent(courseId, path) {
    const key = `${path}/repository/${courseId}`;
    const options = {
      gzip: true,
      cwd: key,
      file: `${key}.tgz`
    };
    this._writtenFiles = uniq(this._writtenFiles);
    return tar.create(options, this._writtenFiles)
        .then(() => Promise.resolve(`${key}.tgz`));
  }
}

module.exports = ArchiveStorage;
