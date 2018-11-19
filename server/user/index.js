'use strict';

const { authorize } = require('../shared/auth/mw');
const ctrl = require('./user.controller');
const model = require('./user.model');
const router = require('express-promise-router')();

const defaultAuth = authorize();

router
  .post('/users/login', ctrl.login)
  .get('/users', defaultAuth, ctrl.index)
  .post('/users', defaultAuth, ctrl.upsert)
  .post('/users/forgotPassword', ctrl.forgotPassword)
  .post('/users/resetPassword', ctrl.resetPassword)
  .delete('/users/:id', defaultAuth, ctrl.remove);

module.exports = {
  model,
  router
};
