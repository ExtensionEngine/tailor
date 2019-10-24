'use strict';

const auth = require('passport').authenticate('jwt');
const { authorize } = require('../shared/auth/mw');
const ctrl = require('./user.controller');
const model = require('./user.model');
const { processPagination } = require('../shared/database/pagination');
const router = require('express').Router();
const { User } = require('../shared/database');

router
  // Public routes:
  .post('/users/login', ctrl.login)
  .post('/users/forgotPassword', ctrl.forgotPassword)
  .post('/users/resetPassword', ctrl.resetPassword)
  // Protected routes:
  .use('/users*', auth, authorize())
  .get('/users', processPagination(User), ctrl.list)
  .post('/users', ctrl.upsert)
  .delete('/users/:id', ctrl.remove)
  .post('/users/:id/reinvite', ctrl.reinvite);

module.exports = {
  model,
  router
};
