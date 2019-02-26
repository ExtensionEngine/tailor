'use strict';

const { getFileUrl, saveFile } = require('./');
const { ASSET_ROOT } = require('./helpers');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const sha256 = buf => crypto.createHash('sha256').update(buf).digest('hex');

function getUrl(req, res) {
  const { query: { key } } = req;
  return getFileUrl(key).then(url => res.json({ url }));
}

async function upload({ file }, res) {
  const buffer = await readFile(file);
  const hash = sha256(buffer);
  const extension = path.extname(file.originalname);
  const key = path.join(ASSET_ROOT, `${hash}${extension}`);
  await saveFile(key, buffer, { ContentType: file.mimetype });
  return res.json({ key });
}

module.exports = { getUrl, upload };

function readFile(file) {
  if (file.buffer) return Promise.resolve(file.buffer);
  return fs.readFile(file.path);
}
