'use strict';

const express = require('express');
const io = require('../shared/io');
const controller = require('./course.controller').controller;
const model = require('./course.model').model;
const middleware = require('./middleware');

const router = express.Router();

router.use('/courses', io.input());
router.get('/courses', controller.list);
router.get('/courses/:courseKey', controller.show);
router.post('/courses', controller.create);
router.patch('/courses/:courseKey', controller.patch);
router.put('/courses/:courseKey', controller.replace);
router.delete('/courses/:courseKey', controller.remove);
router.use('/courses', io.output());

module.exports = {
  controller,
  middleware,
  model,
  router
};
