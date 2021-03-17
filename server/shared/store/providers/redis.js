'use strict';

const IoRedis = require('ioredis');
const isNil = require('lodash/isNil');
const yup = require('yup');

const schema = yup.object().shape({
  ttl: yup.number(),
  port: yup.number().required(),
  host: yup.string().required(),
  password: yup.string()
});

class Redis {
  constructor(config) {
    config = schema.validateSync(config, { stripUnknown: true });
    const { host, port, password, ttl } = config;
    const ioRedisConfig = { host, port, password };
    this.name = 'local';
    this.ttl = ttl;
    this.client = new IoRedis(ioRedisConfig);
  }

  set(key, value, ttl) {
    ttl = !isNil(ttl) ? ttl : this.ttl;
    return this.client.set(key, JSON.stringify(value), 'EX', ttl);
  }

  get(key) {
    return this.client.get(key).then(value => JSON.parse(value));
  }

  has(key) {
    return this.client.exists(key);
  }

  keys(pattern = '*') {
    return this.client.keys(pattern);
  }

  del(key) {
    return this.client.del(key);
  }

  static create(config) {
    return new Redis(config);
  }
}

module.exports = { create: Redis.create };
