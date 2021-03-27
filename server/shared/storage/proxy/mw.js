'use strict';

const { FORBIDDEN } = require('http-status-codes');
const miss = require('mississippi');
const path = require('path');
const router = require('express').Router();

function proxy(storage, accessManager) {
  return router.get('/*', (req, res, next) => {
    const key = req.params[0];
    const hasValidCookies = accessManager.verifyCookies(req.cookies, key);
    if (!hasValidCookies) return res.status(FORBIDDEN).end();
    res.type(path.extname(key));
    miss.pipe(storage.createReadStream(key), res, err => {
      if (err) return next(err);
      res.end();
    });
  });
}

function setSignedCookies(accessManager) {
  return (req, res, next) => {
    const repositoryId = req.repository.id;
    if (accessManager.hasCookies(req.cookies, repositoryId)) return next();
    const maxAge = 1000 * 60 * 60; // 1 hour in ms
    const cookies = accessManager.getSignedCookies(repositoryId, maxAge);
    Object.entries(cookies).forEach(([cookie, value]) => {
      res.cookie(cookie, value, { maxAge, httpOnly: true });
    });
    next();
  };
}

module.exports = { proxy, setSignedCookies };
