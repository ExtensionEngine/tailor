'use strict';

const auth = require('../shared/auth');
const ctrl = require('./user.controller');
const model = require('./user.model');
const router = require('express').Router();

router
  // Public routes:
  .post('/users/login', auth.authenticate('local'), ctrl.login)
  .post('/users/forgotPassword', ctrl.forgotPassword)
  .post('/users/resetPassword', ctrl.resetPassword)
  // Protected routes:
  .use(auth.authenticate('jwt'))
  .get('/users', ctrl.index);

module.exports = {
  model,
  router
};
