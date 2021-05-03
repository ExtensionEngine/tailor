'use strict';

const crypto = require('crypto');
const { requestLimiter } = require('../shared/request/mw');

const loginRequestLimiter = requestLimiter({ keyGenerator: req => req.userKey });

function getKeyFromRequest(req, res, next) {
  const key = [req.ip, req.body.email].join(':');
  req.userKey = crypto.createHash('sha256').update(key).digest('base64');
  return next();
}

function resetLoginAttempts(req, res, next) {
  return loginRequestLimiter.resetKey(req.userKey)
    .then(() => next());
}

module.exports = { loginRequestLimiter, getKeyFromRequest, resetLoginAttempts };
