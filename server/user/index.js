'use strict';

const { authenticate, logout } = require('../shared/auth');
const { ACCEPTED } = require('http-status-codes');
const { authorize } = require('../shared/auth/mw');
const crypto = require('crypto');
const ctrl = require('./user.controller');
const { processPagination } = require('../shared/database/pagination');
const { requestLimiter } = require('../shared/request/mw');
const router = require('express').Router();
const { User } = require('../shared/database');

const loginRequestLimiter = requestLimiter({ keyGenerator: req => req.key });

// Public routes:
router
  .post(
    '/login',
    getKeyFromRequest,
    loginRequestLimiter,
    authenticate('local', { setCookie: true }),
    resetLoginAttempts,
    ctrl.getProfile
  )
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

function getKeyFromRequest(req, res, next) {
  const key = [req.ip, req.body.email].join(':');
  req.key = crypto.createHash('sha256').update(key).digest('base64');
  return next();
}

function resetLoginAttempts(req, res, next) {
  return loginRequestLimiter.resetKey(req.key)
    .then(() => next());
}
