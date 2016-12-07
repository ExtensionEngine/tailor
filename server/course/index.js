'use strict';

const express = require('express');
const controller = require('./course.controller').controller;
const model = require('./course.model').model;
const middleware = require('./middleware');

const router = express.Router();

router.get('/courses/', controller.list);
router.get('/courses/:courseKey', controller.show);
router.post('/courses/', controller.create);
router.patch('/courses/:courseKey', controller.patch);
router.put('/courses/:courseKey', controller.replace);
router.delete('/courses/:courseKey', controller.remove);

module.exports = {
  controller,
  middleware,
  model,
  router
};
