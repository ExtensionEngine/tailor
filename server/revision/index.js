'use strict';

const router = require('express-promise-router')();
const ctrl = require('./revision.controller');

router.get('/courses/:courseId/revisions', ctrl.index);
router.get('/courses/:courseId/revisions/:revId', ctrl.resolve);

module.exports = {
  controller: ctrl,
  router
};
