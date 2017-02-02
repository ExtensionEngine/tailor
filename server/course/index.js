'use strict';

const router = require('express-promise-router')();
const ctrl = require('./course.controller');
const mw = require('./middleware');

// Course access middleware
router.use('/courses/:courseId*', mw.getCourse);
router.use('/courses/:courseId*', mw.hasCourseAccess);

router.get('/courses', ctrl.index);
router.get('/courses/:id', ctrl.get);
router.patch('/courses/:id', ctrl.patch);
router.delete('/courses/:id', ctrl.remove);
router.get('/courses/:courseId/users', ctrl.getUsers);
router.post('/courses/:courseId/users', ctrl.upsertUser);
router.delete('/courses/:courseId/users/:userId', ctrl.removeUser);

module.exports = {
  controller: ctrl,
  middleware: mw,
  router
};
