'use strict';

const { authorize } = require('../shared/auth/mw');
const ctrl = require('./user.controller');
const model = require('./user.model');
const router = require('express-promise-router')();

router
  .post('/users/login', ctrl.login)
  .get('/users', authorize(), ctrl.index)
  .post('/users', authorize(), ctrl.upsert)
  .post('/users/forgotPassword', ctrl.forgotPassword)
  .post('/users/resetPassword', ctrl.resetPassword)
  .delete('/users/:id', ctrl.remove);

module.exports = {
  model,
  router
};
