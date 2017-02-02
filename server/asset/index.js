'use strict';

const express = require('express');

const ctrl = require('./asset.controller');
const model = require('./asset.model');
const router = express.Router();

router
  .route('/assets')
  .get(ctrl.list)
  .post(ctrl.create);

router
  .route('/assets/:assetId')
  .get(ctrl.show)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

module.exports = {
  model,
  router
};
