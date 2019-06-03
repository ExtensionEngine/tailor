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

module.exports = { path: '/courses', router };

router
  .use(hasAccess)
  .param('id', getCourse);

router
  .route('/')
  .get(processQuery, ctrl.index)
  .post(authorize(), ctrl.create);

router
  .route('/:id')
  .get(ctrl.get)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

router
  .post('/:id/clone', authorize(), ctrl.clone)
  .post('/:id/publish', ctrl.publishRepoInfo)
  .get('/:id/users', ctrl.getUsers)
  .post('/:id/users', ctrl.upsertUser)
  .delete('/:id/users/:userId', ctrl.removeUser)
  .get('/:id/content-inventory', ctrl.exportContentInventory);

mount(router, '/:id', activity);
mount(router, '/:id', comment);
mount(router, '/:id', revision);
mount(router, '/:id', teachingElement);

function mount(router, mountPath, subrouter) {
  return router.use(path.join(mountPath, subrouter.path), subrouter.router);
}

function getCourse(req, _res, next, id) {
  return Course.findByPk(id, { paranoid: false })
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
