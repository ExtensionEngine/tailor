'use strict';

/**
 * Activity resource.
 * @namespace Activity
 */

const express = require('express');

const controller = require('./activity.controller').controller;
const course = require('../course');
const io = require('../shared/io');
const model = require('./activity.model');

const loadCourse = course.middleware.loadCourse(course.model);
const requireCourseAccess = course.middleware.requireCourseAccess;

const router = express.Router();
const input = io.input();
const output = io.output();

router.get('/courses/:courseKey/activities',
  input,
  requireCourseAccess,
  loadCourse,
  controller.list,
  output);

router.post('/courses/:courseKey/activities',
  input,
  requireCourseAccess,
  loadCourse,
  controller.create,
  output);

router.get('/courses/:courseKey/activities/:activityKey',
  input,
  requireCourseAccess,
  loadCourse,
  controller.show,
  output);

router.patch('/courses/:courseKey/activities/:activityKey',
  input,
  requireCourseAccess,
  loadCourse,
  controller.patch,
  output);

router.delete('/courses/:courseKey/activities/:activityKey',
  input,
  requireCourseAccess,
  loadCourse,
  controller.remove,
  output);

router.post('/courses/:courseKey/activities/:activityKey/actions/reorder',
  input,
  requireCourseAccess,
  loadCourse,
  controller.reorder,
  output);

module.exports = {
  controller,
  model,
  router
};
