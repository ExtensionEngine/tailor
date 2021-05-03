'use strict';

const crypto = require('crypto');
const { requestLimiter } = require('../shared/request/mw');

const loginRequestLimiter = requestLimiter({ keyGenerator: req => req.key });

function getKeyFromRequest(req, res, next) {
  const key = [req.ip, req.body.email].join(':');
  req.key = crypto.createHash('sha256').update(key).digest('base64');
  return next();
}

function resetLoginAttempts(req, res, next) {
  return loginRequestLimiter.resetKey(req.key)
    .then(() => next());
}

module.exports = { loginRequestLimiter, getKeyFromRequest, resetLoginAttempts };
