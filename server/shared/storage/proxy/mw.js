'use strict';

const { FORBIDDEN } = require('http-status-codes');
const miss = require('mississippi');
const path = require('path');
const proxy = require('./');
const storage = require('../');
const config = require('../../../../config/server').storage;
const router = require('express').Router();

function getFile(req, res, next) {
  const key = req.params[0];
  const hasValidCookies = proxy.verifyCookies(req.cookies, key);
  if (!hasValidCookies) return res.status(FORBIDDEN).end();
  res.type(path.extname(key));
  miss.pipe(storage.createReadStream(key), res, err => {
    if (err) return next(err);
    res.end();
  });
}

function setSignedCookies(req, res, next) {
  if (proxy.hasCookies(req.cookies)) return next();
  // 1 hour in ms
  const maxAge = 1000 * 60 * 60;
  const cookies = proxy.getSignedCookies(config.path, maxAge);
  Object.entries(cookies).forEach(([cookie, value]) => {
    res.cookie(cookie, value, { maxAge, httpOnly: true });
  });
  next();
}

module.exports = { proxy: router.get('/*', getFile), setSignedCookies };
