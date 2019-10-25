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
  .post('/users/forgot-password', ctrl.forgotPassword)
  .post('/users/reset-password', ctrl.resetPassword)
  // Protected routes:
  .use('/users*', auth)
  .get('/users', authorize(), processPagination(User), ctrl.list)
  .post('/users', authorize(), ctrl.upsert)
  .post('/users/me/change-password', ctrl.changePassword)
  .patch('/users/me', ctrl.updateProfile)
  .delete('/users/:id', authorize(), ctrl.remove)
  .post('/users/:id/reinvite', authorize(), ctrl.reinvite);

module.exports = {
  model,
  router
};
