'use strict';

const router = require('express-promise-router')();
const mw = require('../course/middleware');
const ctrl = require('./revision.controller');

router.use('/courses/:courseId*', mw.getCourse);
router.use('/courses/:courseId*', mw.hasCourseAccess);

router.get('/courses/:courseId/revisions', ctrl.index);

module.exports = {
  controller: ctrl,
  router
};
