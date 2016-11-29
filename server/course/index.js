'use strict';
const express = require('express');
const controller = require('./course.controller').controller;

const router = express.Router();
router.get('/', controller.getMany);
router.post('/', controller.create);
router.get('/:courseKey', controller.getByKey);
router.patch('/:courseKey', controller.updateByKey);
router.put('/:courseKey', controller.replaceByKey);
router.delete('/:courseKey', controller.removeByKey);

module.exports = {
  router
};
