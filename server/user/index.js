'use strict';

const express = require('express');
const controller = require('./user.controller').controller;

const router = express.Router();

router.post('/users', controller.create);
router.post('/users/actions/login', controller.login);
router.post('/users/actions/logout', controller.logout);
// router.get('/users/me', controller.show);

module.exports = {
  router
};
