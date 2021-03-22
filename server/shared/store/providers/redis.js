'use strict';

const IoRedis = require('ioredis');
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
    this.name = 'redis';
    this.ttl = ttl;
    this.client = new IoRedis(ioRedisConfig);
  }

  set(key, value, ttl = this.ttl) {
    const args = [key, JSON.stringify(value)];
    if (ttl) args.push('EX', ttl);
    return this.client.set(...args);
  }

  get(key) {
    return this.client.get(key).then(value => JSON.parse(value));
  }

  has(key) {
    return this.client.exists(key);
  }

  getKeys(pattern = '*') {
    return this.client.keys(pattern);
  }

  delete(key) {
    return this.client.del(key);
  }

  static create(config) {
    return new Redis(config);
  }
}

module.exports = { create: Redis.create };
