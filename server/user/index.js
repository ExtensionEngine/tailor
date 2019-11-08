'use strict';

const { authenticate } = require('../shared/auth');
const { authorize } = require('../shared/auth/mw');
const ctrl = require('./user.controller');
const { processPagination } = require('../shared/database/pagination');
const router = require('express').Router();
const { User } = require('../shared/database');

router
  // Public routes:
  .post('/login', authenticate('local'), ctrl.login)
  .post('/forgot-password', ctrl.forgotPassword)
  .post('/reset-password', authenticate('token'), ctrl.resetPassword)
  // Protected routes:
  .use(authenticate('jwt'))
  .get('/', authorize(), processPagination(User), ctrl.list)
  .post('/', authorize(), ctrl.upsert)
  .post('/me/change-password', ctrl.changePassword)
  .patch('/me', ctrl.updateProfile)
  .delete('/:id', authorize(), ctrl.remove)
  .post('/:id/reinvite', authorize(), ctrl.reinvite);

module.exports = {
  path: '/users',
  router
};
