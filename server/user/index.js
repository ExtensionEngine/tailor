'use strict';

const auth = require('passport').authenticate('jwt');
const { authorize } = require('../shared/auth/mw');
const ctrl = require('./user.controller');
const { processPagination } = require('../shared/database/pagination');
const router = require('express').Router();
const { User } = require('../shared/database');

router
  // Public routes:
  .post('/login', ctrl.login)
  .post('/forgot-password', ctrl.forgotPassword)
  .post('/reset-password', ctrl.resetPassword)
  // Protected routes:
  .use(auth)
  .get('/', ctrl.index)
  .use('/users*', auth, authorize())
  .get('/users', processPagination(User), ctrl.list)
  .post('/users', ctrl.upsert)
  .delete('/users/:id', ctrl.remove)
  .post('/users/:id/reinvite', ctrl.reinvite);

module.exports = {
  path: '/users',
  router
};
