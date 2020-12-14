'use strict';

const { getFileUrl, saveFile } = require('./');
const { readFile, sha256 } = require('./util');
const config = require('../../../config/server').storage;
const path = require('path');

function getUrl(req, res) {
  const { query: { key } } = req;
  return getFileUrl(key).then(url => res.json({ url }));
}

async function upload({ file }, res) {
  const buffer = await readFile(file);
  const hash = sha256(file.originalname, buffer);
  const extension = path.extname(file.originalname);
  const name = path.basename(file.originalname, extension).substring(0, 180).trim();
  const key = path.join(config.path, `${hash}___${name}${extension}`);
  await saveFile(key, buffer, { ContentType: file.mimetype });
  const publicUrl = await getFileUrl(key);
  return res.json({ key, url: `${config.protocol}${key}`, publicUrl });
}

module.exports = { getUrl, upload };
