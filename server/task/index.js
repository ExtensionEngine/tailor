'use strict';

const ctrl = require('./task.controller');
const router = require('express').Router();

router
  .get('/', ctrl.list);

module.exports = {
  path: '/tasks',
  router
};
