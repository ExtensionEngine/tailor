'use strict';
const express = require('express');
const controller = require('./course.controller').controller;

const router = express.Router();
router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:courseKey', controller.get);
router.patch('/:courseKey', controller.update);
router.put('/:courseKey', controller.replace);
router.delete('/:courseKey', controller.remove);

module.exports = {
  router
};
