'use strict';

const parse = require('url-parse');

const { HOSTNAME, SERVER_URL } = process.env;
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  // Legacy config support
  hostname: HOSTNAME || (isProduction ? SERVER_URL : parse(SERVER_URL).hostname),
  port: process.env.PORT || process.env.SERVER_PORT,
  ip: process.env.IP
};
