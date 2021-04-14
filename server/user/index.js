'use strict';

const { authenticate, logout } = require('../shared/auth');
const { ACCEPTED } = require('http-status-codes');
const { authorize } = require('../shared/auth/mw');
const ctrl = require('./user.controller');
const { processPagination } = require('../shared/database/pagination');
const { requestLimiter } = require('../shared/request/mw');
const router = require('express').Router();
const { User } = require('../shared/database');

// Public routes:
router
  .post('/login', authenticate('local', { setCookie: true }), ctrl.getProfile)
  .post('/forgot-password', ctrl.forgotPassword)
  .use('/reset-password', requestLimiter(), authenticate('token'))
  .post('/reset-password', ctrl.resetPassword)
  .post('/reset-password/token-status', (_, res) => res.sendStatus(ACCEPTED));

// Protected routes:
router
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
