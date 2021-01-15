'use strict';

const { auth: authConfig } = require('../../../config/server');
const { createError } = require('../error/helpers');
const get = require('lodash/get');
const { user: role } = require('../../../config/shared/role');
const { UNAUTHORIZED } = require('http-status-codes');

function authorize(...allowed) {
  allowed.push(role.ADMIN);
  return ({ user }, res, next) => {
    if (user && allowed.includes(user.role)) return next();
    return createError(UNAUTHORIZED, 'Access restricted');
  };
}

function extractAuthStrategy(req, res, next) {
  const path = authConfig.jwt.cookie.signed ? 'signedCookies' : 'cookies';
  req.authStrategy = get(req[path], 'strategy', null);
  return next();
}

module.exports = {
  authorize,
  extractAuthStrategy
};
