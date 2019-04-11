'use strict';

const { Storage } = require('../storage');
const path = require('path');
const tar = require('tar');

class ArchiveStorage extends Storage {
  constructor(config) {
    super(config);
    this._writtenFiles = new Set();
  }
  saveFile(key, data, options = {}) {
    this._writtenFiles.add(key);
    return super.saveFile(key, data, options);
  }

  archiveContent(courseId, storagePath) {
    const options = {
      gzip: true,
      cwd: storagePath,
      file: path.join(storagePath, `${courseId}.tgz`)
    };
    return tar.create(options, Array.from(this._writtenFiles))
        .then(() => path.join(storagePath, `${courseId}.tgz`));
  }
}

module.exports = ArchiveStorage;
