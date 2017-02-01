'use strict';

const express = require('express');
const controller = require('./activity.controller').controller;
const io = require('../shared/io');
const model = require('./activity.model').model;

const router = express.Router();
const input = io.input();
const output = io.output();

router.get('/courses/:courseId/activities',
  input,
  controller.list,
  output);

router.post('/courses/:courseId/activities',
  input,
  controller.create,
  output);

router.get('/courses/:courseId/activities/:activityKey',
  input,
  controller.show,
  output);

router.patch('/courses/:courseId/activities/:activityKey',
  input,
  controller.patch,
  output);

router.delete('/courses/:courseId/activities/:activityKey',
  input,
  controller.remove,
  output);

router.post('/courses/:courseId/activities/:activityKey/actions/reorder',
  input,
  controller.reorder,
  output);

module.exports = {
  controller,
  model,
  router
};
