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
    const query = io.locals.load(req, 'search').query;
    const pagination = io.locals.load(req, 'pagination');
    const sort = io.locals.load(req, 'sort');

    const courseKeys = req.user.role === role.ADMIN ? null : req.user.courses;
    const courseName = isEmpty(query) ? null : query;
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
