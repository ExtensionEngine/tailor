'use strict';

const { getFileUrl, saveFile } = require('./');
const { ASSET_ROOT } = require('./helpers');
const { URL } = require('url');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

async function getUrl({ query }, res) {
  const url = await getFileUrl(query.key);
  res.json({ url });
}

async function resolveUrl({ body }, res) {
  const { key } = parseUrl(body.url);
  const url = await getFileUrl(key, { download: body.download });
  res.redirect(url);
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

module.exports = { resolveUrl, getUrl, upload };

function readFile(file) {
  if (file.buffer) return Promise.resolve(file.buffer);
  return fs.readFile(file.path);
}

function sha256(...args) {
  const hash = crypto.createHash('sha256');
  args.forEach(arg => hash.update(arg));
  return hash.digest('hex');
}

function parseUrl(url) {
  const { protocol, hostname, pathname } = new URL(url);
  const key = path.join(hostname, pathname);
  return { protocol, key };
}
