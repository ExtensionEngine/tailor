'use strict';

const ctrl = require('./user.controller');
const model = require('./user.model');
const router = require('express-promise-router')();

router
  .post('/users/login', ctrl.login)
  .get('/users', ctrl.index)
  .post('/users/forgotPassword', ctrl.forgotPassword)
  .post('/users/resetPassword', ctrl.resetPassword)
  .get('/users/generateIntegrationToken', ctrl.generateIntegrationToken);

module.exports = {
  model,
  router
};
