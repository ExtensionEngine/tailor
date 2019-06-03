'use strict';

const auth = require('passport').authenticate('jwt');
const ctrl = require('./user.controller');
const router = require('express').Router();

router
  // Public routes:
  .post('/login', ctrl.login)
  .post('/forgot-password', ctrl.forgotPassword)
  .post('/reset-password', ctrl.resetPassword)
  // Protected routes:
  .use(auth)
  .get('/', ctrl.index);

module.exports = {
  path: '/users',
  router
};
