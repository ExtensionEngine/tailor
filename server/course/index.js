'use strict';

const ctrl = require('./course.controller');
const middleware = require('./middleware');
const router = require('express-promise-router')();

router.get('/courses', ctrl.index);

module.exports = {
  controller: ctrl,
  middleware,
  router
};
