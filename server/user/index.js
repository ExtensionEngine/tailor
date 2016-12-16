'use strict';

const express = require('express');
const passport = require('passport');
const io = require('../shared/io');
const controller = require('./user.controller').controller;
const model = require('./user.model').model;

const router = express.Router();
const input = io.input();
const output = io.output();

router.post('/users',
  input,
  controller.create,
  output);

router.post('/users/actions/login',
  input,
  passport.authenticate('local'),
  controller.login,
  output);

router.post('/users/actions/logout',
  input,
  controller.logout,
  output);

// router.post('/users/:userKey/relationships/courses/:courseKey',
//   input,
//   // TODO(matej): validate both userKey and courseKey
//   controller.addUserToCourse,
//   output);

module.exports = {
  controller,
  model,
  router
};
