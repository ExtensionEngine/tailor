'use strict';

/**
 * Activity resource.
 * @namespace Activity
 */

const ctrl = require('./activity.controller');
const model = require('./activity.model');
const router = require('express-promise-router')();

// TODO: require course access

router
  .route('/courses/:courseId/activities')
  .get(ctrl.list)
  .post(ctrl.create);

router
  .route('/courses/:courseId/activities/:activityId')
  .get(ctrl.show)
  // .patch(ctrl.patch)
  .delete(ctrl.remove);

router
  .post('/courses/:courseId/activities/:activityId/actions/reorder', ctrl.reorder);

module.exports = {
  model,
  router
};
