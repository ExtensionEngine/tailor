'use strict';

const { NOT_FOUND, UNAUTHORIZED } = require('http-status-codes');
const { authorize } = require('../shared/auth/mw');
const { Course } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const ctrl = require('./course.controller');
const path = require('path');
const processQuery = require('../shared/util/processListQuery')();
const router = require('express').Router();

const activity = require('../activity');
const comment = require('../comment');
const revision = require('../revision');
const teachingElement = require('../teaching-element');

router
  .param('courseId', getCourse)
  .use(hasAccess);

router.route('/')
  .get(processQuery, ctrl.index)
  .post(authorize(), ctrl.create);

router.route('/:courseId')
  .get(ctrl.get)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

router
  .post('/:courseId/pin', ctrl.pin)
  .post('/:courseId/clone', authorize(), ctrl.clone)
  .post('/:courseId/publish', ctrl.publishRepoInfo)
  .get('/:courseId/users', ctrl.getUsers)
  .post('/:courseId/users', ctrl.upsertUser)
  .delete('/:courseId/users/:userId', ctrl.removeUser)
  .get('/:courseId/content-inventory', ctrl.exportContentInventory);

mount(router, '/:courseId', activity);
mount(router, '/:courseId', revision);
mount(router, '/:courseId', teachingElement);
mount(router, '/:courseId', comment);

function mount(router, mountPath, subrouter) {
  return router.use(path.join(mountPath, subrouter.path), subrouter.router);
}

function getCourse(req, _res, next, courseId) {
  return Course.findByPk(courseId, { paranoid: false })
    .then(course => course || createError(NOT_FOUND, 'Course not found'))
    .then(course => {
      req.course = course;
      next();
    });
}

function hasAccess(req, _res, next) {
  const { user, course } = req;
  if (user.isAdmin()) return next();
  return course.getUser(user)
    .then(user => user || createError(UNAUTHORIZED, 'Access restricted'))
    .then(user => {
      req.courseRole = user.courseUser.role;
      next();
    });
}

module.exports = {
  path: '/courses',
  router
};
