'use strict';

const { authorize } = require('../shared/auth/mw');
const { Course } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND, UNAUTHORIZED } = require('http-status-codes');
const ctrl = require('./course.controller');
const processQuery = require('../shared/util/processListQuery')();
const router = require('express').Router();

router
  .param('id', getCourse)
  .use('/courses/:id*', hasAccess)
  .get('/courses', processQuery, ctrl.index)
  .post('/courses', authorize(), ctrl.create)
  .get('/courses/:id', ctrl.get)
  .patch('/courses/:id', ctrl.patch)
  .delete('/courses/:id', ctrl.remove)
  .post('/courses/:id/pin', ctrl.pin)
  .post('/courses/:id/clone', authorize(), ctrl.clone)
  .post('/courses/:id/publish', ctrl.publishRepoInfo)
  .get('/courses/:id/users', ctrl.getUsers)
  .post('/courses/:id/users', ctrl.upsertUser)
  .delete('/courses/:id/users/:userId', ctrl.removeUser)
  .get('/courses/:id/contentInventory', ctrl.exportContentInventory);

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

module.exports = {
  ctrl,
  router
};
