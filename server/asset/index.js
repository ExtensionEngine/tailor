'use strict';

const express = require('express');

const controller = require('./asset.controller').controller;
const course = require('../course');
const io = require('../shared/io');
const model = require('./asset.model');

const loadCourse = course.middleware.loadCourse(course.model);
const requireCourseAccess = course.middleware.requireCourseAccess;

const router = express.Router();
const input = io.input();
const output = io.output();

router.get('/courses/:courseKey/assets',
  input,
  requireCourseAccess,
  loadCourse,
  controller.list,
  output
);

router.get('/courses/:courseKey/assets/:assetKey',
  input,
  requireCourseAccess,
  loadCourse,
  controller.show,
  output
);

router.post('/courses/:courseKey/assets/',
  input,
  requireCourseAccess,
  loadCourse,
  controller.create,
  output
);

router.patch('/courses/:courseKey/assets/:assetKey',
  input,
  requireCourseAccess,
  loadCourse,
  controller.patch,
  output
);

router.put('/courses/:courseKey/assets/:assetKey',
  input,
  requireCourseAccess,
  loadCourse,
  controller.replace,
  output
);

router.delete('/courses/:courseKey/assets/:assetKey',
  input,
  requireCourseAccess,
  loadCourse,
  controller.remove,
  output
);

module.exports = {
  controller,
  model,
  router
};
