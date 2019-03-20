'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const storage = require('../storage');
const tar = require('tar');
class Storage extends storage.Storage {
  static create(config) {
    return new Storage(config);
  }
  readDir(key) {
    return fs.readdirAsync(key);
  }
  delDir(key) {
    return fs.removeAsync(key);
  }
}
const tempStorage = Storage.create({
  filesystem: {
    path: 'temp'
  },
  provider: 'filesystem'
});
function getFileNames(key) {
  const folderPath = `temp/repository/${key}`;
  return tempStorage.readDir(folderPath);
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
  return tempStorage.delDir(folder);
}

module.exports = {
  getFileNames,
  deleteDir,
  prepZip
};
