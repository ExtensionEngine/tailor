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
  .patch('/users', ctrl.patch)
  // Protected routes:
  .get('/users', auth, ctrl.index);

module.exports = {
  model,
  router
};
