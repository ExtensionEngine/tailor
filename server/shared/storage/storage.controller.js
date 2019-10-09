'use strict';

const { getFileUrl, saveFile } = require('./');
const { ASSET_ROOT } = require('./helpers');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function getUrl(req, res) {
  const { query: { key, ...options } } = req;
  return getFileUrl(key, options).then(url => res.json({ url }));
}

async function upload({ file }, res) {
  const { originalname } = file;
  const buffer = await readFile(file);
  const hash = sha256(originalname, buffer);
  const extension = path.extname(originalname);
  const name = path.basename(originalname, extension).substring(0, 180).trim();
  const key = path.join(ASSET_ROOT, `${hash}___${name}${extension}`);
  await saveFile(key, buffer, { ContentType: file.mimetype });
  const publicUrl = await getFileUrl(key);
  return res.json({ name: originalname, key, publicUrl, url: `storage://${key}` });
}

module.exports = { getUrl, upload };

function readFile(file) {
  if (file.buffer) return Promise.resolve(file.buffer);
  return fs.readFile(file.path);
}

function sha256(...args) {
  const hash = crypto.createHash('sha256');
  args.forEach(arg => hash.update(arg));
  return hash.digest('hex');
}
