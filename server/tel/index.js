'use strict';

const ctrl = require('./tel.controller');
const model = require('./tel.model');
const router = require('express-promise-router')();

router
  .route('/courses/:courseId/tel')
  .get(ctrl.list)
  .post(ctrl.create);

router
  .route('/courses/:courseId/tel/:telId')
  .get(ctrl.show)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

router.post('/courses/:courseId/tel/:telId/reorder', ctrl.reorder);

module.exports = {
  model,
  router
};
