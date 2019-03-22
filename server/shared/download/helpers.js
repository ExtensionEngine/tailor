'use strict';

const { Storage } = require('../storage');
const { PublishingService } = require('../publishing/publishing.service');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const tar = require('tar');

class TempStorage extends Storage {
  constructor(config) {
    super(config);
    this.writtenFiles = [];
  }
  saveFile(key, data, options = {}) {
    this.writtenFiles.push(key);
    return super.saveFile(key, data, options);
  }
}
class DownloadingService extends PublishingService {
  constructor(config) {
    super(config);
    this.storage = new TempStorage(config);
  }
}

function prepZip(courseId, files) {
  const key = `temp/repository/${courseId}`;
  return tar.c(
    {
      gzip: true,
      C: key,
      file: `${key}.tgz`
    },
    files);
}
function deleteDir(folder) {
  return fs.removeAsync(folder);
}

function prepFiles(files) {
  files.pop();
  return files.map(file => file.split('/').pop());
}

module.exports = {
  DownloadingService,
  deleteDir,
  prepZip,
  prepFiles
};
