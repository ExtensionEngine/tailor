'use strict';

const { getFileUrl, saveFile } = require('./');
const { ASSET_ROOT } = require('./helpers');
const { URL } = require('url');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function getUrl(req, res) {
  const { query: { key } } = req;
  return getFileUrl(key).then(url => res.json({ url }));
}

function resolveUrl({ body }, res, next) {
  if (body.action !== 'resolve') return next();
  const { key } = parseUrl(body.url);
  return getFileUrl(key).then(url => res.redirect(url));
}

async function upload({ file }, res) {
  const buffer = await readFile(file);
  const hash = sha256(file.originalname, buffer);
  const extension = path.extname(file.originalname);
  const key = path.join(ASSET_ROOT, `${hash}${extension}`);
  await saveFile(key, buffer, { ContentType: file.mimetype });
  return res.json({ key });
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
