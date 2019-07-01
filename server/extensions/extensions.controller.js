'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const util = require('util');

const mkdirpAsync = util.promisify(mkdirp);
const DIST_PATH = path.join(__dirname, '../../dist');

function write(sourceFile, destFile) {
  const readStream = fs.createReadStream(sourceFile);
  const writeStream = fs.createWriteStream(destFile);

  readStream.pipe(writeStream);

  return new Promise((resolve, reject) => {
    writeStream
      .on('finish', resolve)
      .on('error', reject);
    readStream.on('error', reject);
  });
}

async function install({ body }, res) {
  const { name, scriptPath, stylePath } = body;

  console.log(`Installing ${name}...`);

  try {
    await mkdirpAsync(DIST_PATH);
    await write(scriptPath, path.join(DIST_PATH, 'extensions.js'));
    await write(stylePath, path.join(DIST_PATH, 'extensions.css'));
  } catch (err) {
    console.error('Something went wrong: ' + err);
  }

  res.end();
}

async function subscribe(req, res) {
}

module.exports = {
  install,
  subscribe
};
