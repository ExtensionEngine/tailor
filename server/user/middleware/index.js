'use strict';

const loadUser = require('./loadUser');
const requireAuth = require('./requireAuth');

module.exports = {
  loadUser,
  requireSystemAdmin: requireAuth.requireSystemAdmin,
  requireAdmin: requireAuth.requireAdmin,
  requireContentAuthor: requireAuth.requireContentAuthor,
  requireRole: requireAuth.requireRole,
  requireUser: requireAuth.requireUser
};
