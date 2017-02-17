'use strict';

const router = require('express-promise-router')();
const ctrl = require('./revision.controller');

router.get('/courses/:courseId/revisions', ctrl.index);

module.exports = {
  controller: ctrl,
  router
};
