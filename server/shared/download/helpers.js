'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const JSZip = require('jszip');
const path = require('path');

function getFileNames(key) {
  const folderPath = `temp/repository/${key}`;
  return fs.readdirAsync(folderPath);
}
function prepZip(files, courseId) {
  return new Promise((resolve) => {
    const zip = new JSZip();
    Promise.map(files, (file) => {
      const key = `../../../temp/repository/${courseId}/${file}`;
      const filePath = path.join(__dirname, key);
      return fs.readFileAsync(filePath, 'utf8')
      .then(data => {
        zip.file(file, data);
      });
    })
  .then(() => {
    return zip.generateAsync({ type: 'nodebuffer' })
    .then((file) => resolve(fs.writeFileAsync(`temp/repository/${courseId}.zip`, file)));
  });
  });
}
function deleteDir(folder) {
  return fs.removeAsync(folder);
}

module.exports = {
  getFileNames,
  deleteDir,
  prepZip
};
