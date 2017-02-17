'use strict';

const router = require('express-promise-router')();
const mw = require('../course/middleware');
const ctrl = require('./revision.controller');

router.get('/courses/:courseId/revisions', ctrl.index);

module.exports = {
  controller: ctrl,
  router
};
