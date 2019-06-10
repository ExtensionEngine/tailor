'use strict';

const bunyan = require('bunyan');

const logLevel = (() => {
  if (process.env.LOG_LEVEL) return process.env.LOG_LEVEL;
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
})();

const logger = bunyan.createLogger({
  name: 'tailor-server',
  serializers: bunyan.stdSerializers,
  level: logLevel
});

module.exports = logger;
