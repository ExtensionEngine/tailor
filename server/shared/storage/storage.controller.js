'use strict';

const { ASSET_ROOT, STORAGE_PROTOCOL } = require('./helpers');
const { URL } = require('url');
const { promisify } = require('util');
const crypto = require('crypto');
const path = require('path');
const readFile = promisify(require('fs').readFile);
const urlJoin = require('url-join');

const createUrl = key => urlJoin(STORAGE_PROTOCOL, key);

async function getUrl({ app, query }, res) {
  const storage = app.get('storage');
  const url = await storage.getFileUrl(query.key);
  res.json({ url });
}

async function resolveUrl({ app, body }, res) {
  const { key } = parseUrl(body.url);
  const storage = app.get('storage');
  const url = await storage.getFileUrl(key, { download: body.download });
  res.redirect(url);
}

async function upload({ app, file }, res) {
  const buffer = await toBuffer(file);
  const hash = sha256(file.originalname, buffer);
  const extension = path.extname(file.originalname);
  const name = path.basename(file.originalname, extension).substring(0, 180).trim();
  const key = path.join(ASSET_ROOT, `${hash}___${name}${extension}`);
  const storage = app.get('storage');
  await storage.saveFile(key, buffer, { ContentType: file.mimetype });
  const url = createUrl(key);
  const publicUrl = await storage.getFileUrl(key);
  return res.json({ filename: file.originalname, key, url, publicUrl });
}

module.exports = { resolveUrl, getUrl, upload };

function toBuffer(file) {
  if (file.buffer) return Promise.resolve(file.buffer);
  return readFile(file.path);
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
