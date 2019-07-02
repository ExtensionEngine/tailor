'use strict';

const ctrl = require('./activeUser.controller');
const router = require('express').Router();
const { middleware: sse } = require('../shared/util/sse');
const { subscribe } = require('../course/channel');

const onUnsubscribe = ({ courseId, sse, user }) => {
  ctrl.removeSession(courseId, user.id, sse.id);
};

router.get('/subscribe', sse, (req, res) => {
  const { user } = req;
  const { sse } = res;
  const params = { sse, user };
  return subscribe(req, res, { onUnsubscribe, params });
});

router
  .get('/', ctrl.fetch)
  .post('/', ctrl.add)
  .post('/remove', ctrl.remove);

module.exports = {
  ctrl,
  router
};
