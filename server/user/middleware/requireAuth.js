'use strict';

const ADMIN = require('../role').ADMIN;

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

const requireAdmin = requireRole(ADMIN);

module.exports = {
  requireAdmin,
  requireRole,
  requireUser
};
