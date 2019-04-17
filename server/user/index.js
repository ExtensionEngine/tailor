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
  .post('/users/me/:id/saveImageKey', auth, ctrl.saveImageKey)
  .post('/users/me/:id/deleteImageKey', auth, ctrl.deleteImageKey)
  .post('/users/me/:id/changePassword', auth, ctrl.changePassword)
  .patch('/users/me', auth, ctrl.updateProfile)
  .get('/users', auth, ctrl.index);

module.exports = {
  model,
  router
};
