'use strict';

const ctrl = require('./extensions.controller');
const router = require('express').Router();
const { middleware: sse } = require('../shared/util/sse');

router
  .get('/extensions/subscribe', sse, ctrl.subscribe)
  .post('/extensions', ctrl.install);

module.exports = {
  router
};
