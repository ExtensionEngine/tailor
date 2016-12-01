'use strict';

const express = require('express');
const controller = require('./course.controller').controller;

const router = express.Router();
router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:courseKey', controller.show);
router.patch('/:courseKey', controller.patch);
router.put('/:courseKey', controller.replace);
router.delete('/:courseKey', controller.remove);

module.exports = {
  router
};
