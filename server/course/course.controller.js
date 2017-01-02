'use strict';

const BaseController = require('../base.controller');
const courseModel = require('./course.model').model;
const io = require('../shared/io');
const role = require('../user/role');

class CourseController extends BaseController {
  constructor(model = courseModel, resourceKey = 'courseKey') {
    super(model, resourceKey);

    this.listCoursesForUser = this.listCoursesForUser.bind(this);
  }

  listCoursesForUser(req, res, next) {
    const courseKeys = req.user.role !== role.ADMIN ? req.user.courses : null;
    const search = req.query.search && req.query.search.length ? req.query.search : null;

    const getCourses = this.model.getFiltered.bind(this.model, courseKeys, search);

    // const search = req.user.role === role.ADMIN
    //   ? this.model.getMany.bind(this.model)
    //   : this.model.getByKeys.bind(this.model, req.user.courses);

    getCourses()
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
