'use strict';

const ctrl = require('./te.controller');
const model = require('./te.model');
const processQuery = require('../shared/util/processListQuery')();
const router = require('express').Router();

router
  .route('/courses/:courseId/tes')
  .get(processQuery, ctrl.list)
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
