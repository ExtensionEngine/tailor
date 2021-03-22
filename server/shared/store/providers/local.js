'use strict';

const isNil = require('lodash/isNil');
const LRU = require('lru-cache');
const micromatch = require('micromatch');
const yup = require('yup');

const schema = yup.object().shape({
  maxAge: yup.number()
});

class Local {
  constructor(config) {
    config = schema.validateSync(config, { stripUnknown: true });
    this.name = 'local';
    this.maxAge = config.maxAge;
    this.client = new LRU({ maxAge: config.maxAge });
  }

  set(key, value, ttl) {
    ttl = !isNil(ttl) ? ttl * 1000 : this.maxAge;
    return Promise.resolve(this.client.set(key, value, ttl));
  }

  get(key) {
    return Promise.resolve(this.client.get(key));
  }

  has(key) {
    return Promise.resolve(this.client.has(key));
  }

  getKeys(pattern = '*') {
    const keys = this.client.keys();
    return Promise.resolve(micromatch(keys, pattern));
  }

  delete(key) {
    return Promise.resolve(this.client.del(key));
  }

  static create(config) {
    return new Local(config);
  }
}

module.exports = { create: Local.create };
