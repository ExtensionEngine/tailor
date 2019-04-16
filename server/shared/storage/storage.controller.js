'use strict';

const { createError } = require('../error/helpers');
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { URL } = require('url');
const path = require('path');

async function getUploadConfig(req, res) {
  const storage = req.app.get('storage');
  const config = await storage.getUploadConfig(req.body);
  if (config) return res.json(config);
  if (!storage.uploadHandler) {
    return createError(INTERNAL_SERVER_ERROR, 'Unable to create upload config.');
  }
  const url = path.join(req.baseUrl, req.path);
  return res.json({
    url,
    isPublic: false,
    response: {
      type: 'json',
      keys: { key: 'key' }
    }
  });
}

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
  const { uploadHandler } = req.app.get('storage');
  if (uploadHandler) return uploadHandler(req, res, next);
  return createError(BAD_REQUEST, 'Server does not support direct upload of assets.');
}

module.exports = { getUploadConfig, getPublicUrl, resolveUrl, upload };

function parseUrl(url) {
  const { protocol, hostname, pathname } = new URL(url);
  const key = path.join(hostname, pathname);
  return { protocol, key };
}
