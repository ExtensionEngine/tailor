'use strict';
const BaseController = require('../base.controller');
const courseModel = require('./course.model').model;

class CourseController extends BaseController {
  constructor(model = courseModel, resourceKey = 'courseKey') {
    super(model, resourceKey);
  }
}

module.exports = {
  Controller: CourseController,
  controller: new CourseController()
};
