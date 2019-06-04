'use strict';

const auth = require('passport').authenticate('jwt');
const ctrl = require('./user.controller');
const model = require('./user.model');
const router = require('express').Router();

router
  // Public routes:
  .post('/users/login', ctrl.login)
  .post('/users/forgot-password', ctrl.forgotPassword)
  .post('/users/reset-password', ctrl.resetPassword)
  // Protected routes:
  .use(auth)
  .post('/users/me/change-password', ctrl.changePassword)
  .patch('/users/me', ctrl.updateProfile)
  .get('/users', ctrl.index);

module.exports = {
  model,
  router
};
