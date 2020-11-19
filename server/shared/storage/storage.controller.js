'use strict';

const { getFileUrl, saveFile } = require('./');
const { readFile, sha256 } = require('./util');
const { ASSET_ROOT } = require('./helpers');
const path = require('path');
const scorm = require('./scorm');

function getUrl(req, res) {
  const { query: { key } } = req;
  return getFileUrl(key).then(url => res.json({ url }));
}

async function upload({ file }, res) {
  const buffer = await readFile(file);
  const hash = sha256(file.originalname, buffer);
  const extension = path.extname(file.originalname);
  const name = path.basename(file.originalname, extension).substring(0, 180).trim();
  const key = path.join(ASSET_ROOT, `${hash}___${name}${extension}`);
  await saveFile(key, buffer, { ContentType: file.mimetype });
  const publicUrl = await getFileUrl(key);
  return res.json({ key, url: `storage://${key}`, publicUrl });
}

async function uploadScormPackage({ file }, res) {
  const launchUrl = await scorm.savePackage(file);
  return res.json({ launchUrl });
}

module.exports = { getUrl, upload, uploadScormPackage };
