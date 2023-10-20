'use strict';

const config = require('../../../../config/server');
const { FORBIDDEN } = require('http-status-codes');
const miss = require('mississippi');
const path = require('path');
const router = require('express').Router();
const psl = require('psl');

module.exports = (storage, proxy) => {
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
    const cookies = proxy.getSignedCookies(maxAge);
    const { domain } = psl.parse(config.hostname);
    const cookieOptions = { domain, maxAge, httpOnly: true };
    Object.entries(cookies).forEach(([cookie, value]) => {
      res.cookie(cookie, value, cookieOptions);
    });
    next();
  }

  return { proxy: router.get('/*', getFile), setSignedCookies };
};
