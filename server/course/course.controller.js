'use strict';

const BaseController = require('../base.controller');
const courseModel = require('./course.model').model;
const userModel = require('../user/user.model').model;
const io = require('../shared/io');
const isEmpty = require('lodash/isEmpty');
const role = require('../../config/shared').role;

// TODO(marko): move to middleware
const isString = require('lodash/isString');

class CourseController extends BaseController {
  constructor(model = courseModel, resourceKey = 'courseKey') {
    super(model, resourceKey);

    this.userModel = userModel;
    this.listCoursesForUser = this.listCoursesForUser.bind(this);
    this.listUsersForCourse = this.listUsersForCourse.bind(this);
  }

  listCoursesForUser(req, res, next) {
    const courseKeys = req.user.role === role.SYSTEM_ADMIN ? null : req.user.courses;
    const courseName = isEmpty(req.query.query) ? null : req.query.query;

    this.model.getFiltered({ courseKeys, courseName })
      .then(courses => {
        io.setOK(res, courses);
        next();
      })
      .catch(next);
  }

  // TODO(marko): add query course access?
  listUsersForCourse(req, res, next) {
    let email = req.query.email;
    const courseKey = req.params.courseKey;

    // TODO(marko): move search validation to middleware
    email = isString(email) && !isEmpty(email) ? email : null;

    this.userModel.getFiltered({ courseKey, email })
      .then(users => {
        io.setOK(res, users);
        next();
      })
      .catch(next);
  }
}

module.exports = {
  Controller: CourseController,
  controller: new CourseController()
};
