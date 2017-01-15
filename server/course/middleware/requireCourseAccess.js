'use strict';

const get = require('lodash/get');
const role = require('../../../config/shared').role;

function requireCourseAccess(req, res, next) {
  const courseKey = req.params.courseKey;
  const userHasAccess = get(req, 'user.courses', []).includes(courseKey);
  const userIsSystemAdmin = get(req, 'user.role') === role.SYSTEM_ADMIN;
  const userIsAdmin = get(req, 'user.role') === role.ADMIN;

  if (userIsSystemAdmin || userIsAdmin || userHasAccess) next();
  else res.status(401).json();
}

module.exports = requireCourseAccess;
