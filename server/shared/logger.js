'use strict';

const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'tailor-server',
  serializers: bunyan.stdSerializers,
  level: bunyan.levelFromName.debug
});

module.exports = logger;
