'use strict';

const auth = require('passport').authenticate('jwt');
const ctrl = require('./user.controller');
const model = require('./user.model');
const router = require('express-promise-router')();

router
  // Public routes:
  .post('/users/login', ctrl.login)
  .post('/users/forgotPassword', ctrl.forgotPassword)
  .post('/users/resetPassword', ctrl.resetPassword)
  // Protected routes:
  .post('/users/me/:id/changePassword', ctrl.changePassword)
  .get('/users/me', auth, ctrl.getProfile)
  .patch('/users/me', auth, ctrl.updateProfile)
  .get('/users', auth, ctrl.index);

module.exports = {
  model,
  router
};
