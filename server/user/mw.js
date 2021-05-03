'use strict';

const crypto = require('crypto');

function getKeyFromRequest(req, res, next) {
  const key = [req.ip, req.body.email].join(':');
  req.key = crypto.createHash('sha256').update(key).digest('base64');
  return next();
}

function resetLoginAttempts(requestLimiter) {
  return (req, res, next) => {
    return requestLimiter.resetKey(req.key)
      .then(() => next());
  };
}

module.exports = { getKeyFromRequest, resetLoginAttempts };
