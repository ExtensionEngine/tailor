'use strict';

const ctrl = require('./activeUser.controller');
const router = require('express').Router();
const { middleware: sse } = require('../shared/util/sse');
const { subscribe } = require('../course/channel');

router.get('/subscribe', sse, (req, res) => subscribe(req, res, ctrl.removeSession));

router
  .get('/', ctrl.fetch)
  .post('/', ctrl.add)
  .post('/remove', ctrl.remove)
  .post('/remove-session', ctrl.removeSession);

module.exports = {
  ctrl,
  router
};
