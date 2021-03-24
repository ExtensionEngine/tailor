'use strict';

const LRU = require('lru-cache');
const micromatch = require('micromatch');
const yup = require('yup');

const schema = yup.object().shape({
  ttl: yup.number()
});

class Local {
  constructor(config) {
    config = schema.validateSync(config, { stripUnknown: true });
    this.ttl = config.ttl;
    this.client = new LRU({ maxAge: this.ttl * 1000 });
  }

  set(key, value, ttl = this.ttl) {
    return Promise.resolve(this.client.set(key, value, ttl * 1000));
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
