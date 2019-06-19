'use strict';

const ctrl = require('./activeUser.controller');
const router = require('express').Router();
const { middleware: sse } = require('../shared/util/sse');
const { subscribe } = require('../course/channel');

router.get('/subscribe', sse, subscribe);

router
  .get('/', ctrl.fetch)
  .post('/', ctrl.add)
  .post('/remove', ctrl.remove);

module.exports = {
  ctrl,
  router
};
