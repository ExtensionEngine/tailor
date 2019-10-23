'use strict';

const { authorize } = require('../shared/auth/mw');
const { Repository } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND, UNAUTHORIZED } = require('http-status-codes');
const ctrl = require('./repository.controller');
const processQuery = require('../shared/util/processListQuery')();
const router = require('express').Router();

router
  .param('id', getRepository)
  .use('/repositories/:id*', hasAccess)
  .get('/repositories', processQuery, ctrl.index)
  .post('/repositories', authorize(), ctrl.create)
  .get('/repositories/:id', ctrl.get)
  .patch('/repositories/:id', ctrl.patch)
  .delete('/repositories/:id', ctrl.remove)
  .post('/repositories/:id/pin', ctrl.pin)
  .post('/repositories/:id/clone', authorize(), ctrl.clone)
  .post('/repositories/:id/publish', ctrl.publishRepoInfo)
  .get('/repositories/:id/users', ctrl.getUsers)
  .post('/repositories/:id/users', ctrl.upsertUser)
  .delete('/repositories/:id/users/:userId', ctrl.removeUser)
  .get('/repositories/:id/contentInventory', ctrl.exportContentInventory);

function getRepository(req, _res, next, id) {
  return Repository.findByPk(id, { paranoid: false })
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
  ctrl,
  router
};
