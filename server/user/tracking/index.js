'use strict';

const ctrl = require('./controller');
const { middleware: sse } = require('../../shared/sse');
const router = require('express').Router();

router.get('/subscribe', sse, ctrl.subscribe);

router.route('/')
  .get(ctrl.fetch)
  .post(ctrl.add)
  .delete(ctrl.remove);

module.exports = {
  path: '/active-users',
  router
};
