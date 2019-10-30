'use strict';

const { authenticate } = require('../shared/auth');
const { authorize } = require('../shared/auth/mw');
const ctrl = require('./user.controller');
const model = require('./user.model');
const { processPagination } = require('../shared/database/pagination');
const router = require('express').Router();
const { User } = require('../shared/database');

router
  // Public routes:
  .post('/users/login', authenticate('local'), ctrl.login)
  .post('/users/forgot-password', ctrl.forgotPassword)
  .post('/users/reset-password', authenticate('token'), ctrl.resetPassword)
  // Protected routes:
  .use('/users*', authenticate('jwt'), authorize())
  .get('/users', processPagination(User), ctrl.list)
  .post('/users', ctrl.upsert)
  .delete('/users/:id', ctrl.remove)
  .post('/users/:id/reinvite', ctrl.reinvite);

module.exports = {
  model,
  router
};
