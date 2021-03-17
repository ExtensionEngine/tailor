'use strict';

module.exports = {
  provider: process.env.STORE_PROVIDER || 'local',
  local: {
    maxAge: parseInt(process.env.LOCAL_STORE_MAXAGE, 10) || 0
  },
  redis: {
    ttl: parseInt(process.env.REDIS_STORE_TTL, 10) || 0,
    port: parseInt(process.env.REDIS_STORE_PORT, 10) || 6379,
    host: process.env.REDIS_STORE_HOST || 'localhost',
    password: process.env.REDIS_STORE_PASSWORD
  }
};
