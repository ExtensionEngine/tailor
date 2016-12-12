'use strict';

const express = require('express');
const io = require('../shared/io');
const controller = require('./course.controller').controller;
const model = require('./course.model').model;
const middleware = require('./middleware');

const router = express.Router();
const input = io.input();
const output = io.output();

router.get('/courses',
  input,
  controller.list,
  output);

router.get('/courses/:courseKey',
  input,
  controller.show,
  output);

router.post('/courses',
  input,
  controller.create,
  output);

router.patch('/courses/:courseKey',
  input,
  controller.patch,
  output);

router.put('/courses/:courseKey',
  input,
  controller.replace,
  output);

router.delete('/courses/:courseKey',
  input,
  controller.remove,
  output);

module.exports = {
  controller,
  middleware,
  model,
  router
};
