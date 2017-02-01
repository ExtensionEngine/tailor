const { NOT_FOUND, UNAUTHORIZED } = require('http-status-codes');
const { course: role } = require('../../../config/shared').role;
const { Course } = require('../../shared/database/sequelize');
const { createError } = require('../../shared/error/helpers');

/**
 * Attach course model to the request.
 */
function getCourse(req, res) {
  const { courseId } = req.params;
  return Course
    .findById(courseId)
    .then(course => course || createError(NOT_FOUND, 'Course not found'))
    .then(course => {
      req.course = course;
      return Promise.resolve('next');
    });
};

/**
 * Check whether user has general course api access.
 * Add (user) course role to the context. Requires
 * user and course on request context.
 */
function hasCourseAccess(req, res) {
  const { user, course } = req;
  if (user.isAdmin()) return Promise.resolve('next');
  return course.getUser(user)
    .then(user => user || createError(UNAUTHORIZED, 'Access restricted'))
    .then(user => {
      req.courseRole = user.courseUser.role;
      return Promise.resolve('next');
    });
};

/**
 * Check if user has course admin privilegies.
 * Requires user and courseRole on request
 * context.
 */
function isCourseAdmin(req, res) {
  const { user, courseRole } = req;
  if (!user.isAdmin() && courseRole !== role.ADMIN) {
    createError(UNAUTHORIZED, 'Access restricted');
  }

  return Promise.resolve('next');
};

module.exports = {
  getCourse,
  hasCourseAccess,
  isCourseAdmin
};
