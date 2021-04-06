'use strict';

const { authenticate, logout } = require('../shared/auth');
const { ACCEPTED } = require('http-status-codes');
const { authorize } = require('../shared/auth/mw');
const ctrl = require('./user.controller');
const { processPagination } = require('../shared/database/pagination');
const rateLimit = require('express-rate-limit');
const router = require('express').Router();
const { User } = require('../shared/database');

// Max 5 (default) requests allowed every 15 minutes
const requestLimiter = rateLimit({ windowMs: 15 * 60 * 1000 });

// Public routes:
router
  .post('/login', authenticate('local', { setCookie: true }), ctrl.getProfile)
  .post('/forgot-password', ctrl.forgotPassword);

router
  .use('/password', requestLimiter, authenticate('token'))
  .post('/password/reset', ctrl.resetPassword)
  .post('/password/token-validation', (_, res) => res.sendStatus(ACCEPTED));

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
