export default {
  provider: process.env.STORE_PROVIDER || 'memory',
  ttl: parseInt(process.env.STORE_TTL, 10) || 0,
  memory: {},
  redis: {
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD
  }
};
