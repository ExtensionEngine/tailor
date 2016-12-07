'use strict';

const express = require('express');
const passport = require('passport');
const io = require('../shared/io');
const controller = require('./user.controller').controller;
const model = require('./user.model').model;

const router = express.Router();

router.use('/users', io.input());
router.post('/users', controller.create);
router.post('/users/actions/login', passport.authenticate('local'), controller.login);
router.post('/users/actions/logout', controller.logout);
router.use('/users', io.output());

module.exports = {
  controller,
  model,
  router
};
