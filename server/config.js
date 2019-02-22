'use strict';

const parse = require('url-parse');

const { HOSTNAME, SERVER_URL } = process.env;
const isProduction = process.env.NODE_ENV === 'production';
const LEGACY_HOSTNAME = isProduction ? SERVER_URL : parse(SERVER_URL).hostname;

module.exports = {
  // Legacy config support
  hostname: HOSTNAME || LEGACY_HOSTNAME || 'http://127.0.0.1',
  port: process.env.PORT || process.env.SERVER_PORT,
  ip: process.env.IP
};
