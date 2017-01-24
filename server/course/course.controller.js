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
    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
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

  addUser({ body, params }, res, next) {
    const { userKey, role } = body;
    this.model
      .addUser(params.courseKey, userKey, role)
      .then(course => {
        io.setOK(res, course);
        next();
      })
      .catch(next);
  }

  removeUser(req, res, next) {
    const { courseKey, userKey } = req.params;
    this.model
      .removeUser(courseKey, userKey)
      .then(course => {
        io.setOK(res, course);
        next();
      })
      .catch(next);
  }
}

module.exports = {
  Controller: CourseController,
  controller: new CourseController()
};
