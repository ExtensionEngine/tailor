'use strict';

const Promise = require('bluebird');
const storage = require('../storage');
const hash = require('hash-obj');
const keys = require('lodash/keys');
const pick = require('lodash/pick');
const without = require('lodash/without');
const JSZip = require('jszip');
const fs = Promise.promisifyAll(require('fs-extra'));
const path = require('path');

function getFileNames(key) {
  const folderPath = path.join(__dirname, `../../../tempRepository/${key}`);
  return fs.readdirAsync(folderPath);
}
function prepZip(files, courseId) {
  return new Promise((resolve) => {
    let zip = new JSZip();
    Promise.map(files, (file) => {
      const key = `../../../tempRepository/${courseId}/${file}`;
      const filePath = path.join(__dirname, key);
      return fs.readFileAsync(filePath, 'utf8')
      .then(data => {
        zip.file(file, data);
      });
    })
  .then(() => {
    return zip.generateAsync({ type: 'nodebuffer' })
    .then((file) => resolve(fs.writeFileAsync(`tempRepository/${courseId}.zip`, file)));
  });
  });
}
function deleteDir(folder) {
  return fs.removeAsync(folder);
}
function publishRepositoryDetails(repository) {
  return getPublishedStructure(repository).then(spine => {
    return saveSpine(spine);
  });
}
function getPublishedStructure(repository) {
  return new Promise((resolve) => {
    resolve(getRepositoryAttrs(repository));
  });
}
function getRepositoryAttrs(repository) {
  const attrs = ['id', 'uid', 'schema', 'name', 'description', 'data'];
  let temp = pick(repository, attrs);
  renameKey(temp, 'data', 'meta');
  return temp;
}

function saveSpine(spine) {
  const hashProperties = pick(spine, without(keys(spine), ['version', 'downloadedAt']));
  const version = hash(hashProperties, { algorithm: 'sha1' });
  const updatedSpine = { ...spine, version, publishedAt: new Date() };
  const spineData = Buffer.from(JSON.stringify(updatedSpine), 'utf8');
  const key = `../tempRepository/${spine.id}/index.json`;
  return storage.saveFile(key, spineData);
}

function renameKey(obj, key, newKey) {
  obj[newKey] = obj[key];
  delete obj[key];
}

module.exports = {
  getFileNames,
  publishRepositoryDetails,
  deleteDir,
  prepZip
};
