'use strict';

const ctrl = require('./asset.controller');
const model = require('./asset.model');
const router = require('express-promise-router')();

router
  .route('/courses/:courseId/assets')
  .get(ctrl.list)
  .post(ctrl.create);

router
  .route('/courses/:courseId/assets/:assetId')
  .get(ctrl.show)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

module.exports = {
  model,
  router
};
