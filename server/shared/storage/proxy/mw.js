'use strict';

const config = require('../../../../config/server').storage;
const { FORBIDDEN } = require('http-status-codes');
const miss = require('mississippi');
const path = require('path');
const proxy = require('./');
const storage = require('../');
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
  const maxAge = 1000 * 60 * 60; // 1 hour in ms
  const resource = `${config.path}/${req.repository.id}`;
  const cookies = proxy.getSignedCookies(resource, maxAge);
  Object.entries(cookies).forEach(([cookie, value]) => {
    res.cookie(cookie, value, { maxAge, httpOnly: true });
  });
  next();
}

module.exports = { proxy: router.get('/*', getFile), setSignedCookies };
