'use strict';

const BaseController = require('../base.controller');
const courseModel = require('./course.model').model;
const io = require('../shared/io');
const isEmpty = require('lodash/isEmpty');
const role = require('../user/role');

class CourseController extends BaseController {
  constructor(model = courseModel, resourceKey = 'courseKey') {
    super(model, resourceKey);

    this.listCoursesForUser = this.listCoursesForUser.bind(this);
  }

  listCoursesForUser(req, res, next) {
    const courseKeys = req.user.role === role.ADMIN ? null : req.user.courses;
    const courseName = isEmpty(req.query.name) ? null : req.query.name;

    this.model.getFiltered({ courseKeys, courseName })
      .then(courses => {
        io.setOK(res, courses);
        next();
      })
      .catch(next);
  }
}

module.exports = {
  Controller: CourseController,
  controller: new CourseController()
};
