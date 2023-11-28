import { NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import { authorize } from '../shared/auth/mw.js';
import { createError } from '../shared/error/helpers.js';
import ctrl from './repository.controller.js';
import db from '../shared/database/index.js';
import express from 'express';
import feed from './feed/index.js';
import multer from 'multer';
import path from 'node:path';
import processQuery from '../shared/util/processListQuery.js';
import proxy from './proxy.js';
import proxyMw from '../shared/storage/proxy/mw.js';
import roleConfig from '../../config/shared/role.js';
import storage from './storage.js';

/* eslint-disable */
import activity from '../activity/index.js';
import comment from '../comment/index.js';
import revision from '../revision/index.js';
import contentElement from '../content-element/index.js';
const { user: role } = roleConfig;
import storageRouter from '../shared/storage/storage.router.js';
/* eslint-enable */

const { Repository } = db;
const router = express.Router();
const { setSignedCookies } = proxyMw(storage, proxy);

const {
  EXTERNAL_ACCESS_MANAGEMENT: isExternalAccessManagement
} = process.env;

const authorizeAdminUser = isExternalAccessManagement
  ? authorize(role.INTEGRATION)
  : authorize();
// NOTE: disk storage engine expects an object to be passed as the first argument
// https://github.com/expressjs/multer/blob/6b5fff5/storage/disk.js#L17-L18
const upload = multer({ storage: multer.diskStorage({}) });

router
  .post('/import', authorizeAdminUser, upload.single('archive'), ctrl.import);

router
  .param('repositoryId', getRepository)
  .use('/:repositoryId', hasAccess, setSignedCookies);

router.route('/')
  .get(processQuery({ limit: 100 }), ctrl.index)
  .post(authorize(), ctrl.create);

router.route('/:repositoryId')
  .get(ctrl.get)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

router
  .post('/:repositoryId/pin', ctrl.pin)
  .post('/:repositoryId/clone', authorizeAdminUser, ctrl.clone)
  .post('/:repositoryId/publish', ctrl.publishRepoInfo)
  .get('/:repositoryId/users', authorizeAdminUser, ctrl.getUsers)
  .get('/:repositoryId/export/setup', ctrl.initiateExportJob)
  .post('/:repositoryId/export/:jobId', ctrl.export)
  .post('/:repositoryId/users', authorizeAdminUser, ctrl.upsertUser)
  .delete('/:repositoryId/users/:userId', authorizeAdminUser, ctrl.removeUser)
  .post('/:repositoryId/tags', authorizeAdminUser, ctrl.addTag)
  .delete('/:repositoryId/tags/:tagId', authorizeAdminUser, ctrl.removeTag);

mount(router, '/:repositoryId', feed);
mount(router, '/:repositoryId', activity);
mount(router, '/:repositoryId', revision);
mount(router, '/:repositoryId', contentElement);
mount(router, '/:repositoryId', comment);
mount(router, '/:repositoryId', storageRouter);

function mount(router, mountPath, subrouter) {
  return router.use(path.posix.join(mountPath, subrouter.path), subrouter.router);
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

export default {
  path: '/repositories',
  router
};
