'use strict';

const express = require('express');
const io = require('../shared/io');
const controller = require('./course.controller').controller;
const model = require('./course.model').model;
const middleware = require('./middleware');
const { requireUser } = require('../user').middleware;
const params = require('../shared/middleware').paramParsers;

const router = express.Router();
const input = io.input();
const output = io.output();

router.get('/courses',
  input,
  requireUser,
  params.parsePagination,
  params.parseSearch,
  params.parseSort,
  controller.listCoursesForUser,
  output);

router.get('/courses/:courseKey',
  input,
  middleware.requireCourseAccess,
  controller.show,
  output);

router.post('/courses',
  input,
  requireUser,
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

module.exports = {
  controller,
  middleware,
  model,
  router
};
