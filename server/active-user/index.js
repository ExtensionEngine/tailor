const ctrl = require('./activeUser.controller');
const router = require('express').Router({ mergeParams: true });
const { middleware: sse } = require('../shared/util/sse');
const { subscribe } = require('../active-user/channel');

router.get('/subscribe', sse, subscribe);

router
  .get('/', ctrl.getActiveUsers)
  .post('/', ctrl.addActiveUser)
  .post('/remove', ctrl.removeActiveUser);

module.exports = {
  ctrl,
  router
};
