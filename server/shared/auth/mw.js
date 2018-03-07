const { createError } = require('../error/helpers');
const { UNAUTHORIZED } = require('http-status-codes');
const { user: role } = require('../../../config/shared/role');

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
