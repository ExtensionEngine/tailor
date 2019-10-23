'use strict';

const ctrl = require('./te.controller');
const model = require('./te.model');
const processQuery = require('../shared/util/processListQuery')();
const router = require('express').Router();

router
  .route('/repositories/:repositoryId/tes')
  .get(processQuery, ctrl.list)
  .post(ctrl.create);

router
  .route('/repositories/:repositoryId/tes/:teId')
  .get(ctrl.show)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

router.post('/repositories/:repositoryId/tes/:teId/reorder', ctrl.reorder);

module.exports = {
  model,
  router
};
