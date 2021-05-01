'use strict';

const rateLimit = require('express-rate-limit');
const Tapster = require('@extensionengine/tapster');
const { provider, ...options } = require('../../../config/server').store;

const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // every 15 minutes

// Store must be implemented using the following interface:
// https://github.com/nfriedly/express-rate-limit/blob/master/README.md#store
class Store {
  constructor() {
    this.cache = new Tapster({
      ...options[provider],
      store: provider,
      namespace: 'request-limiter'
    });
  }

  async incr(key, cb) {
    const record = await this.cache.has(key) ? await this.cache.get(key) : { hits: 0 };
    const hits = record.hits + 1;
    await this.cache.set(key, { ...record, hits });
    cb(null, hits);
  }

  async decrement(key) {
    const record = await this.cache.get(key);
    if (!record || !record.hits) return;
    const hits = record.hits - 1;
    await this.cache.set(key, { ...record, hits });
  }

  resetKey(key) {
    return this.cache.delete(key);
  }
}

function requestLimiter({
  max = 10,
  windowMs = DEFAULT_WINDOW_MS,
  store = new Store(),
  ...opts
} = {}) {
  return rateLimit({ max, windowMs, store, ...opts });
}

module.exports = { requestLimiter };
