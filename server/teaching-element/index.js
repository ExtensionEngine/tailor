'use strict';

const ctrl = require('./te.controller');
const model = require('./te.model');
const router = require('express-promise-router')();

router
  .route('/courses/:courseId/tes')
  .get(ctrl.list)
  .post(ctrl.create);

router
  .route('/courses/:courseId/tes/:teId')
  .get(ctrl.show)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

router.post('/courses/:courseId/tes/:teId/reorder', ctrl.reorder);

module.exports = {
  model,
  router
};
