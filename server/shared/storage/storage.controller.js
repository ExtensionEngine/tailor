'use strict';

const { createError } = require('../error/helpers');
const { BAD_REQUEST } = require('http-status-codes');
const { URL } = require('url');
const path = require('path');

async function getPublicUrl({ app, query }, res) {
  const { key } = parseUrl(query.url);
  const storage = app.get('storage');
  const url = await storage.getFileUrl(key);
  res.json({ url });
}

async function resolveUrl({ app, body }, res) {
  const { key } = parseUrl(body.url);
  const storage = app.get('storage');
  const url = await storage.getFileUrl(key, { download: body.download });
  res.redirect(url);
}

async function upload(req, res, next) {
  const storage = req.app.get('storage');
  const { uploadHandler } = storage.provider;
  if (uploadHandler) return uploadHandler(req, res, next);
  return createError(BAD_REQUEST, 'Server does not support direct upload of assets.');
}

module.exports = { getPublicUrl, resolveUrl, upload };

function parseUrl(url) {
  const { protocol, hostname, pathname } = new URL(url);
  const key = path.join(hostname, pathname);
  return { protocol, key };
}
