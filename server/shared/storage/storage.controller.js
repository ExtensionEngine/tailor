'use strict';

const { readFile, sha256 } = require('./util');
const { ASSET_ROOT } = require('./helpers');
const { localhost } = require('../../../config/server');
const path = require('path');
const proxy = require('./proxy');
const storage = require('./');

async function upload({ file }, res) {
  const buffer = await readFile(file);
  const hash = sha256(file.originalname, buffer);
  const extension = path.extname(file.originalname);
  const name = path.basename(file.originalname, extension).substring(0, 180).trim();
  const key = path.join(ASSET_ROOT, `${hash}___${name}${extension}`);
  const headers = {
    ContentType: file.mimetype,
    ContentLength: Buffer.byteLength(buffer)
  };
  await storage.saveFile(key, buffer, headers);
  const publicUrl = await storage.getFileUrl(key);
  return res.json({ key, url: `storage://${key}`, publicUrl });
}

function setSignedCookies(req, res, next) {
  if (proxy.hasCookies(req.cookies)) next();
  const cookies = proxy.getSignedCookies();
  Object.entries(cookies).forEach(([cookie, value]) => {
    res.cookie(cookie, value, { httpOnly: !localhost });
  });
  return res.status(200).end();
}

module.exports = { upload, setSignedCookies };
