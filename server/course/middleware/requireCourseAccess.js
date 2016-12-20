'use strict';

const get = require('lodash/get');
const ADMIN = require('../../user/role').ADMIN;

function requireCourseAccess(req, res, next) {
  const courseKey = req.params.courseKey;
  const userHasAccess = get(req, 'user.courses', []).includes(courseKey);
  const userIsAdmin = get(req, 'user.role') === ADMIN;

  if (userIsAdmin || userHasAccess) next();
  else res.status(401).json();
}

module.exports = requireCourseAccess;
