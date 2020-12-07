'use strict';

const { readFile, sha256 } = require('./util');
const path = require('path');
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

module.exports = { upload };
