'use strict';

const get = require('lodash/get');
const locals = require('../../shared/io').locals;
const { user: role } = require('../../../config/shared').role;

function requireCourseAccess(req, res, next) {
  const user = req.user;
  const course = locals.load(req, 'course');
  const isAdmin = get(req, 'user.role') === role.ADMIN;
  const hasAccess = course.users[user._key];

  if (isAdmin || hasAccess) next();
  else res.status(401).json();
}

module.exports = requireCourseAccess;
