import { auth as authConfig } from '../../../config/server/index.js';
import { createError } from '../error/helpers.js';
import get from 'lodash/get';
import { user as role } from '../../../config/shared/role.js';
import { UNAUTHORIZED } from 'http-status-codes';

function authorize(...allowed) {
  allowed.push(role.ADMIN);
  return ({ user }, res, next) => {
    if (user && allowed.includes(user.role)) return next();
    return createError(UNAUTHORIZED, 'Access restricted');
  };
}

function extractAuthData(req, res, next) {
  const path = authConfig.jwt.cookie.signed ? 'signedCookies' : 'cookies';
  req.authData = get(req[path], 'auth', null);
  return next();
}

export default {
  authorize,
  extractAuthData
};
