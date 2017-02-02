'use strict';

const router = require('express-promise-router')();
const ctrl = require('./assessment.controller');
const mw = require('../course/middleware');

// Course access middleware
router.use('/courses/:courseId*', mw.getCourse);
router.use('/courses/:courseId*', mw.hasCourseAccess);

router.get('/courses/:courseId/assessments', ctrl.index);

module.exports = {
  controller: ctrl,
  router
};
