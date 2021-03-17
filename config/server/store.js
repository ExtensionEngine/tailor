'use strict';

module.exports = {
  provider: process.env.STORE_PROVIDER || 'local',
  local: {
    maxAge: parseInt(process.env.STORE_TTL, 10) || 0
  },
  redis: {
    ttl: parseInt(process.env.STORE_TTL, 10) || 0,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD
  }
};
