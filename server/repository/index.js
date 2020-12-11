'use strict';

const { NOT_FOUND, UNAUTHORIZED } = require('http-status-codes');
const { authorize } = require('../shared/auth/mw');
const { createError } = require('../shared/error/helpers');
const ctrl = require('./repository.controller');
const feed = require('./feed');
const multer = require('multer');
const path = require('path');
const processQuery = require('../shared/util/processListQuery')();
const { Repository } = require('../shared/database');
const router = require('express').Router();
const { setSignedCookies } = require('../shared/storage/proxy/mw');

/* eslint-disable require-sort/require-sort */
const activity = require('../activity');
const comment = require('../comment');
const revision = require('../revision');
const contentElement = require('../content-element');
const task = require('../task');
/* eslint-enable */

// NOTE: disk storage engine expects an object to be passed as the first argument
// https://github.com/expressjs/multer/blob/6b5fff5/storage/disk.js#L17-L18
const upload = multer({ storage: multer.diskStorage({}) });

router
  .post('/import', authorize(), upload.single('archive'), ctrl.import);

router
  .param('repositoryId', getRepository)
  .use('/:repositoryId', hasAccess, setSignedCookies);

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
  .get('/:repositoryId/export/setup', ctrl.initiateExportJob)
  .post('/:repositoryId/export/:jobId', ctrl.export)
  .post('/:repositoryId/users', ctrl.upsertUser)
  .delete('/:repositoryId/users/:userId', ctrl.removeUser)
  .post('/:repositoryId/tags', ctrl.addTag)
  .delete('/:repositoryId/tags/:tagId', ctrl.removeTag);

mount(router, '/:repositoryId', feed);
mount(router, '/:repositoryId', activity);
mount(router, '/:repositoryId', revision);
mount(router, '/:repositoryId', contentElement);
mount(router, '/:repositoryId', comment);
mount(router, '/:repositoryId', task);

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
