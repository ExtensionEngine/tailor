'use strict';

const { authenticate, logout } = require('../shared/auth');
const { authorize } = require('../shared/auth/mw');
const avatarsStorage = require('./storage');
const ctrl = require('./user.controller');
const multer = require('multer');
const { processPagination } = require('../shared/database/pagination');
const router = require('express').Router();
const storageCtrl = require('../shared/storage/storage.controller');
const { User } = require('../shared/database');

const upload = multer({ storage: multer.memoryStorage() });

router
  // Public routes:
  .post('/login', authenticate('local', { setCookie: true }), ctrl.getProfile)
  .post('/forgot-password', ctrl.forgotPassword)
  .post('/reset-password', authenticate('token'), ctrl.resetPassword)
  // Protected routes:
  .use(authenticate('jwt'))
  .get('/', authorize(), processPagination(User), ctrl.list)
  .post('/', authorize(), ctrl.upsert)
  .get('/logout', logout())
  .get('/me', ctrl.getProfile)
  .patch('/me', ctrl.updateProfile)
  .post('/me/change-password', ctrl.changePassword)
  .delete('/:id', authorize(), ctrl.remove)
  .post('/:id/reinvite', authorize(), ctrl.reinvite);

router
  .route('/assets')
  .get(withStorage(storageCtrl.getUrl))
  .post(upload.single('file'), withStorage(storageCtrl.upload));

module.exports = {
  path: '/users',
  router
};

function withStorage(middleware) {
  return (req, res, next) => middleware(avatarsStorage)(req, res, next);
}
