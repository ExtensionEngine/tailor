'use strict';

const { authenticate } = require('../shared/auth');
const ctrl = require('./user.controller');
const model = require('./user.model');
const router = require('express').Router();

router
  // Public routes:
  .post('/users/login', authenticate('local'), ctrl.login)
  .post('/users/forgot-password', ctrl.forgotPassword)
  .post('/users/reset-password', authenticate('token'), ctrl.resetPassword)
  // Protected routes:
  .use(authenticate('jwt'))
  .get('/users', ctrl.index);

module.exports = {
  model,
  router
};
