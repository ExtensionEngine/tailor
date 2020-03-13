'use strict';

const { createError } = require('../error/helpers');
const { user: role } = require('../../../config/shared/role');
const { UNAUTHORIZED } = require('http-status-codes');

function authorize(...allowed) {
  allowed.push(role.ADMIN);
  return ({ user }, res, next) => {
    if (user && allowed.includes(user.role)) return next();
    return createError(UNAUTHORIZED, 'Access restricted');
  };
}

module.exports = {
  authorize
};
