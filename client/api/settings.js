export default {
  API_PATH: ['api', 'v1'],
  env: {
    DEV: {
      protocol: 'http',
      hostname: 'localhost',
      port: require('../../config/server').port
    },
    PROD: {
      protocol: 'https',
      hostname: 'domain.net',
      port: require('../../config/server').port
    }
  }
};
