import config from '../../../../config/server/index.js';
import express from 'express';
import { FORBIDDEN } from 'http-status-codes';
import miss from 'mississippi';
import path from 'node:path';
import psl from 'psl';

const router = express.Router();

export default (storage, proxy) => {
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
    const repositoryId = req.repository.id;
    if (proxy.hasCookies(req.cookies, repositoryId)) return next();
    const maxAge = 1000 * 60 * 60; // 1 hour in ms
    const cookies = proxy.getSignedCookies(repositoryId, maxAge);
    const { domain } = psl.parse(config.hostname);
    const cookieOptions = { domain, maxAge, httpOnly: true };
    Object.entries(cookies).forEach(([cookie, value]) => {
      res.cookie(cookie, value, cookieOptions);
    });
    next();
  }

  return { proxy: router.get('/*', getFile), setSignedCookies };
};
