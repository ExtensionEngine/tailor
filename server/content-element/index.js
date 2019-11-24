'use strict';

const ctrl = require('./content-element.controller');
const processQuery = require('../shared/util/processListQuery')();
const router = require('express').Router();

router.route('/')
  .get(processQuery, ctrl.list)
  .post(ctrl.create);

router.route('/:elementId')
  .get(ctrl.show)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

router
  .post('/:elementId/reorder', ctrl.reorder);

module.exports = {
  path: '/content-elements',
  router
};
