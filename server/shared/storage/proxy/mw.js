'use strict';

const { localhost } = require('../../../../config/server');
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

function setSignedCookies(req, res, next) {
  if (proxy.hasCookies(req.cookies)) next();
  const cookies = proxy.getSignedCookies();
  Object.entries(cookies).forEach(([cookie, value]) => {
    res.cookie(cookie, value, { httpOnly: !localhost });
  });
  next();
}

module.exports = {
  getFile: router.get('/*', getFile),
  setSignedCookies
};
