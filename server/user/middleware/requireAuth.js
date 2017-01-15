'use strict';

const role = require('../../../config/shared').role;

function requireUser(req, res, next) {
  if (req.user) next();
  else res.status(401).json();
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) next();
    else res.status(401).json();
  };
}

const requireSystemAdmin = requireRole(role.SYSTEM_ADMIN);
const requireAdmin = requireRole(role.ADMIN);
const requireContentAuthor = requireRole(role.CONTENT_AUTHOR);

module.exports = {
  requireSystemAdmin,
  requireAdmin,
  requireContentAuthor,
  requireRole,
  requireUser
};
