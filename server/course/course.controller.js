'use strict';

const BaseController = require('../base.controller');
const courseModel = require('./course.model').model;
const userModel = require('../user/user.model').model;
const io = require('../shared/io');
const role = require('../../config/shared').role;

class CourseController extends BaseController {
  constructor(model = courseModel, resourceKey = 'courseKey') {
    super(model, resourceKey);

    this.userModel = userModel;
    this.listCoursesForUser = this.listCoursesForUser.bind(this);
  }

  listCoursesForUser(req, res, next) {
    const pagination = io.locals.load(req, 'pagination');
    const sort = io.locals.load(req, 'sort');

    const courseName = io.locals.load(req, 'search').query;
    const courseKeys = req.user.role === role.SYSTEM_ADMIN ? null : req.user.courses;
    const filter = { courseKeys, courseName };

    this.model.getFiltered(filter, pagination, sort)
      .then(results => {
        io.setOK(res, results);
        next();
      })
      .catch(next);
  }
}

module.exports = {
  Controller: CourseController,
  controller: new CourseController()
};
