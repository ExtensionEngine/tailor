'use strict';

const ctrl = require('./controller');
const { middleware: sse } = require('@extensionengine/sse');
const router = require('express').Router();

router.get('/subscribe', sse, ctrl.subscribe);

router.route('/')
  .get(ctrl.fetchUserActivities)
  .post(ctrl.addUserActivity)
  .delete(ctrl.removeUserActivity);

module.exports = {
  path: '/feed',
  router
};
