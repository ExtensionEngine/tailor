'use strict';

const rateLimit = require('express-rate-limit');

const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // every 15 minutes

function requestLimiter({ max = 10, windowMs = DEFAULT_WINDOW_MS, ...opts } = {}) {
  return rateLimit({ max, windowMs, ...opts });
}

module.exports = { requestLimiter };
