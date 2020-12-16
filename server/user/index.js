'use strict';

const { authenticate, logout } = require('../shared/auth');
const { authorize } = require('../shared/auth/mw');
const ctrl = require('./user.controller');
const { processPagination } = require('../shared/database/pagination');
const router = require('express').Router();
const { User } = require('../shared/database');

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

module.exports = {
  path: '/users',
  router
};
