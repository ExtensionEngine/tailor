'use strict';

const { NOT_FOUND, UNAUTHORIZED } = require('http-status-codes');
const { authorize } = require('../shared/auth/mw');
const { createError } = require('../shared/error/helpers');
const ctrl = require('./repository.controller');
const path = require('path');
const processQuery = require('../shared/util/processListQuery')();
const { Repository } = require('../shared/database');
const router = require('express').Router();

const activity = require('../activity');
const comment = require('../comment');
const revision = require('../revision');
const contentElement = require('../content-element');

router
  .param('repositoryId', getRepository)
  .use(hasAccess);

router.route('/')
  .get(processQuery, ctrl.index)
  .post(authorize(), ctrl.create);

router.route('/:repositoryId')
  .get(ctrl.get)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

router
  .post('/:repositoryId/pin', ctrl.pin)
  .post('/:repositoryId/clone', authorize(), ctrl.clone)
  .post('/:repositoryId/publish', ctrl.publishRepoInfo)
  .get('/:repositoryId/users', ctrl.getUsers)
  .post('/:repositoryId/users', ctrl.upsertUser)
  .delete('/:repositoryId/users/:userId', ctrl.removeUser);

mount(router, '/:repositoryId', activity);
mount(router, '/:repositoryId', revision);
mount(router, '/:repositoryId', contentElement);
mount(router, '/:repositoryId', comment);

function mount(router, mountPath, subrouter) {
  return router.use(path.join(mountPath, subrouter.path), subrouter.router);
}

function getRepository(req, _res, next, repositoryId) {
  return Repository.findByPk(repositoryId, { paranoid: false })
    .then(repository => repository || createError(NOT_FOUND, 'Repository not found'))
    .then(repository => {
      req.repository = repository;
      next();
    });
}

function hasAccess(req, _res, next) {
  const { user, repository } = req;
  if (user.isAdmin()) return next();
  return repository.getUser(user)
    .then(user => user || createError(UNAUTHORIZED, 'Access restricted'))
    .then(user => {
      req.repositoryRole = user.repositoryUser.role;
      next();
    });
}

module.exports = {
  path: '/repositories',
  router
};
