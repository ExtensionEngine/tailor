'use strict';

const mime = require('mime');
const proxy = require('./');
const storage = require('../');
const config = require('../../../../config/server').storage;
const router = require('express').Router();

function getFile(req, res) {
  const hasValidCookies = proxy.verifyCookies(req.cookies);
  if (!hasValidCookies) return res.status(403).end();
  const key = req.params[0];
  const readStream = storage.createReadStream(key);
  res.setHeader('Content-Type', mime.lookup(key));
  readStream.pipe(res);
}

function setSignedCookies(req, res, next) {
  if (proxy.hasCookies(req.cookies)) next();
  // 1 hour in ms
  const maxAge = 1000 * 60 * 60;
  const cookies = proxy.getSignedCookies(config.path, maxAge);
  Object.entries(cookies).forEach(([cookie, value]) => {
    res.cookie(cookie, value, { maxAge, httpOnly: true });
  });
  return next();
}

module.exports = { proxy: router.get('/*', getFile), setSignedCookies };
