'use strict';

const ctrl = require('./course.controller');
const middleware = require('./middleware');
const router = require('express-promise-router')();

router.get('/courses', ctrl.index);
router.patch('/courses/:id', ctrl.canPatch, ctrl.patch);
router.delete('/courses/:id', ctrl.canRemove, ctrl.remove);

module.exports = {
  controller: ctrl,
  middleware,
  router
};
