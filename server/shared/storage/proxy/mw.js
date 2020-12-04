'use strict';

const mime = require('mime');
const proxy = require('./');
const storage = require('../');
const router = require('express').Router();

function getFile(req, res) {
  const hasValidCookies = proxy.verifyCookies(req.cookies);
  if (!hasValidCookies) return res.status(403).end();
  const { returnType } = req.query;
  const key = req.params[0];
  if (returnType === 'url') {
    return storage.getFileUrl(key).then(url => res.json({ url }));
  }
  const readStream = storage.createReadStream(key);
  res.setHeader('Content-Type', mime.lookup(key));
  readStream.pipe(res);
}

module.exports = router.get('/*', getFile);
