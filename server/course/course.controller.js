'use strict';
const BaseController = require('../base.controller');
const courseModel = require('./course.model').model;

class CourseController extends BaseController {
  constructor(model = courseModel, resourceName = 'course') {
    super(model, resourceName);
  }
}

module.exports = {
  Controller: CourseController,
  controller: new CourseController()
};
