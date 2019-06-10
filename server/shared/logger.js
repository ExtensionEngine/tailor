'use strict';

const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'tailor-server',
  serializers: bunyan.stdSerializers,
  level: process.env.LOG_LEVEL
});

module.exports = logger;
