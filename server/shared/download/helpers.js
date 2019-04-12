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

  get filepaths() {
    if (this._writtenFiles) {
      return Array.from(this._writtenFiles);
    }
  }

  archiveContents(courseId, storagePath) {
    const filename = `${courseId}.tgz`;
    const options = {
      gzip: true,
      cwd: storagePath,
      file: path.join(storagePath, filename)
    };
    return tar.create(options, this.filepaths)
        .then(() => path.join(storagePath, filename));
  }
}

module.exports = ArchiveStorage;
