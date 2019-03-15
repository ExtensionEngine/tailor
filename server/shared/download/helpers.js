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
function prepZip(courseId) {
  return new Promise((resolve) => {
    resolve(tar.c(
      {
        gzip: true,
        C: `temp/repository/`,
        P: false
      },
      [`${courseId}`])
    .pipe(fs.createWriteStream(`temp/repository/${courseId}.tar`)));
  });
}
/*
const zip = new JSZip();
Promise.map(files, (file) => {
  const key = `../../../temp/repository/${courseId}/${file}`;
  const filePath = path.join(__dirname, key);
  return tempStorage.getFile(filePath, { encoding: 'utf8' })
  .then(data => {
    zip.file(file, data);
  });
})
.then(() => {
return zip.generateAsync({ type: 'nodebuffer' })
.then((file) => resolve(tempStorage.saveFile(`repository/${courseId}.zip`, file)));
});
*/

function deleteDir(folder) {
  return tempStorage.delDir(folder);
}

module.exports = {
  getFileNames,
  deleteDir,
  prepZip
};
