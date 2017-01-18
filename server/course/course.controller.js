'use strict';

const BaseController = require('../base.controller');
const io = require('../shared/io');
const role = require('../../config/shared').role;
const courseModelInst = require('./course.model').model;
const userModelInst = require('../user/user.model').model;

class CourseController extends BaseController {
  constructor(courseModel = courseModelInst, userModel = userModelInst, resourceKey = 'courseKey') {
    super(courseModel, resourceKey);

    this.userModel = userModel;
    this.inviteUser = this.inviteUser.bind(this);
    this.revokeAccess = this.revokeAccess.bind(this);
    this.listUsersForCourse = this.listUsersForCourse.bind(this);
    this.listCoursesForUser = this.listCoursesForUser.bind(this);
  }

  listCoursesForUser(req, res, next) {
    const pagination = io.locals.load(req, 'pagination');
    const sort = io.locals.load(req, 'sort');

    const courseName = io.locals.load(req, 'search').query;
    const courseKeys = req.user.role === role.SYSTEM_ADMIN ? null : req.user.courses;
    const filter = { courseKeys, courseName };

    this.model
      .getFiltered(filter, pagination, sort)
      .then(results => {
        io.setOK(res, results);
        next();
      })
      .catch(next);
  }

  listUsersForCourse(req, res, next) {
    const courseKey = req.params.courseKey;
    const email = io.locals.load(req, 'search').query;

    // TODO(marko): Temporary fix, build this array dynamically.
    const roles = req.user.role === role.SYSTEM_ADMIN
      ? [role.ADMIN, role.CONTENT_AUTHOR]
      : [role.CONTENT_AUTHOR];

    this.model
      .getUsers({ courseKey, email, roles })
      .then(users => {
        io.setOK(res, users);
        next();
      })
      .catch(next);
  }

  inviteUser(req, res, next) {
    const { email, role } = req.body;
    const courseKey = req.params.courseKey;

    // TODO(marko): Should create inactive user and sent invitation link
    // to their email. This invitation link should lead to password set
    // page. Alternatively, entire add / invite flow should be different.
    this.userModel
      .inviteToCourse(email, role, courseKey)
      .then(user => {
        io.setOK(res, user);
        next();
      })
      .catch(next);
  }

  revokeAccess(req, res, next) {
    const { userKey, courseKey } = req.params;
    this.userModel
      .revokeCourseAccess(userKey, courseKey)
      .then(user => {
        io.setOK(res, user);
        next();
      })
      .catch(next);
  }
}

module.exports = {
  Controller: CourseController,
  controller: new CourseController()
};
