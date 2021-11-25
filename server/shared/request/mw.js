'use strict';

const rateLimit = require('express-rate-limit');
const Tapster = require('@extensionengine/tapster');
const { provider, ...options } = require('../../../config/server').store;

const DEFAULT_STORE_NAMESPACE = 'default-request-limiter';
const DEFAULT_WINDOW_MINUTES = 5;
const DEFAULT_WINDOW_MS = DEFAULT_WINDOW_MINUTES * 60 * 1000;

// Store must be implemented using the following interface:
// https://github.com/nfriedly/express-rate-limit/blob/master/README.md#store
class Store {
  /**
   * @param {string} namespace namespace for the keys that need to be stored
   * @param {number} windowMs ttl in milliseconds
   */
  constructor(namespace, windowMs) {
    this.cache = new Tapster({
      ...options[provider],
      store: provider,
      namespace,
      ttl: windowMs / 1000 // Tapster expects input in seconds
    });
  }

  async incr(key, cb) {
    const initialState = { hits: 0 };
    const { hits, ...record } = await this.cache.has(key)
      ? await this.cache.get(key)
      : initialState;
    await this.cache.set(key, { ...record, hits: hits + 1 });
    cb(null, hits);
  }

  async decrement(key) {
    const { hits, ...record } = await this.cache.get(key) || {};
    if (!hits) return;
    return this.cache.set(key, { ...record, hits: hits - 1 });
  }

  resetKey(key) {
    return this.cache.delete(key);
  }
}

const defaultStore = new Store(DEFAULT_STORE_NAMESPACE, DEFAULT_WINDOW_MS);

function requestLimiter({ max = 10, namespace, windowMs, ...opts } = {}) {
  let store;
  // If namespace and windowMs are not provided, use the default store
  if (!namespace && !windowMs) {
    store = defaultStore;
    windowMs = DEFAULT_WINDOW_MS;
  } else if (namespace && windowMs) {
    store = new Store(namespace, windowMs);
  } else {
    throw new Error(`
      Namespace and windowMs are required to create a custom store.
      Omit both for default store with ${DEFAULT_WINDOW_MINUTES}min window.`);
  }

  return rateLimit({ max, windowMs, store, ...opts });
}

module.exports = { requestLimiter };
