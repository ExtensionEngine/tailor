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
  .get('/users', auth, ctrl.index)
  .post('/users', auth, ctrl.upsert)
  .delete('/users/:id', auth, ctrl.remove);

module.exports = {
  model,
  router
};
