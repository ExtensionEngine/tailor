'use strict';

const crypto = require('crypto');
const fs = require('fs');

function sha256(...args) {
  const hash = crypto.createHash('sha256');
  args.forEach(arg => hash.update(arg));
  return hash.digest('hex');
}

function readFile(file) {
  if (file.buffer) return Promise.resolve(file.buffer);
  return fs.readFile(file.path);
}

module.exports = { sha256, readFile };
