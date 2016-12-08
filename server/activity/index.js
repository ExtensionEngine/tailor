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

router.use('/courses/:courseKey/activities', io.input());
router.get('/courses/:courseKey/activities',
  loadCourse,
  controller.list);

router.post('/courses/:courseKey/activities/',
  loadCourse,
  controller.create);

router.get('/courses/:courseKey/activities/:activityKey', controller.show);
//
// router.patch('/courses/:courseKey/activities/:activityKey',
//   loadCourse,
//   controller.patch);
//
// router.put('/courses/:courseKey/activities/:activityKey',
//   loadCourse,
//   controller.replace);
//
// router.delete('/courses/:courseKey/activities/:activityKey',
//   loadCourse,
//   controller.remove);
router.use('/courses/:courseKey/activities', io.output());

module.exports = {
  controller,
  model,
  router
};
