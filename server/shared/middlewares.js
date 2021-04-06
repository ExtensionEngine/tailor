'use strict';

const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // every 15 minutes

function requestLimiter({ max = 10, windowMs = DEFAULT_WINDOW_MS, ...opts } = {}) {
  return rateLimit({ max, windowMs, ...opts });
}

function slowDownRequests(args = {}) {
  const { windowMs = DEFAULT_WINDOW_MS, delayAfter = 5, delayMs = 100, ...opts } = args;
  return slowDown({ windowMs, delayAfter, delayMs, ...opts });
}

module.exports = {
  requestLimiter,
  slowDownRequests
};
