'use strict';

const loadUser = require('./loadUser');
const requireAuth = require('./requireAuth');

module.exports = {
  loadUser,
  requireAdmin: requireAuth.requireAdmin,
  requireRole: requireAuth.requireRole,
  requireUser: requireAuth.requireUser
};
