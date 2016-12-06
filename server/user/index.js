'use strict';

const express = require('express');
const passport = require('passport');
const controller = require('./user.controller').controller;

const router = express.Router();

router.post('/users', controller.create);
router.post('/users/actions/login', passport.authenticate('local'), controller.login);
router.post('/users/actions/logout', controller.logout);

module.exports = {
  router
};
