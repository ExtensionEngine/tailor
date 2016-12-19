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

router.get('/users',
  input,
  controller.list,
  output);

router.get('/users/:userKey',
  input,
  controller.show,
  output);

router.post('/users/:userKey/access/courses/:courseKey',
  input,
  controller.grantAccessToCourse,
  output);

router.delete('/users/:userKey/access/courses/:courseKey',
  input,
  controller.revokeAccessToCourse,
  output);

module.exports = {
  controller,
  model,
  router
};
