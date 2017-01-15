'use strict';

const express = require('express');
const io = require('../shared/io');
const controller = require('./course.controller').controller;
const model = require('./course.model').model;
const middleware = require('./middleware');
const { requireUser } = require('../user').middleware;

const router = express.Router();
const input = io.input();
const output = io.output();

router.get('/courses',
  input,
  requireUser,
  controller.listCoursesForUser,
  output);

router.get('/courses/:courseKey',
  input,
  middleware.requireCourseAccess,
  controller.show,
  output);

router.post('/courses',
  input,
  middleware.requireCourseAccess,
  controller.create,
  output);

router.patch('/courses/:courseKey',
  input,
  middleware.requireCourseAccess,
  controller.patch,
  output);

router.put('/courses/:courseKey',
  input,
  middleware.requireCourseAccess,
  controller.replace,
  output);

router.delete('/courses/:courseKey',
  input,
  middleware.requireCourseAccess,
  controller.remove,
  output);

router.get('/courses/:courseKey/users',
  input,
  middleware.requireCourseAccess,
  controller.listUsersForCourse,
  output);

module.exports = {
  controller,
  middleware,
  model,
  router
};
