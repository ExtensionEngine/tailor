'use strict';

const { hostname } = require('../../config/server');
const logger = require('./logger');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = () => {
  if (hostname) return middleware;
  const message = 'Origin: "HOSTNAME" is not set, using "Host" HTTP header.';
  isProduction ? logger.warn('⚠️ ', message) : logger.info(message);
  return middleware;
};

function middleware(req, _, next) {
  Object.defineProperty(req, 'origin', {
    get: () => `${req.protocol}://${hostname || req.get('host')}`
  });
  next();
}
