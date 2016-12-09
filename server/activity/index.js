'use strict';
/**
 * Activity resource.
 * @namespace Activity
 */

const express = require('express');
const io = require('../shared/io');
const controller = require('./activity.controller').controller;
const model = require('./activity.model').model;
const course = require('../course');
const loadCourse = course.middleware.loadCourse(course.model);

const router = express.Router();
const input = io.input();
const output = io.output();

router.get('/courses/:courseKey/activities',
  input,
  loadCourse,
  controller.list,
  output);
router.post('/courses/:courseKey/activities',
  input,
  loadCourse,
  controller.create,
  output);
router.get('/courses/:courseKey/activities/:activityKey',
  input,
  loadCourse,
  controller.show,
  output);
router.delete('/courses/:courseKey/activities/:activityKey',
  input,
  loadCourse,
  controller.remove,
  output);
router.post('/courses/:courseKey/activities/:activityKey/actions/reorder',
  input,
  loadCourse,
  controller.reorder,
  output);

module.exports = {
  controller,
  model,
  router
};
