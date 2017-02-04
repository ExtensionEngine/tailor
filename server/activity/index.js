'use strict';

const ctrl = require('./activity.controller');
const model = require('./activity.model');
const router = require('express-promise-router')();

router
  .route('/courses/:courseId/activities')
  .get(ctrl.list)
  .post(ctrl.create);

router
  .route('/courses/:courseId/activities/:activityId')
  .get(ctrl.show)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

router.post('/courses/:courseId/activities/:activityId/reorder', ctrl.reorder);

module.exports = {
  model,
  router
};
