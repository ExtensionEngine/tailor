'use strict';
const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'tailor-server',
  serializers: bunyan.stdSerializers
});

module.exports = logger;
