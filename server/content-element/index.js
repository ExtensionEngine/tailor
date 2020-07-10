'use strict';

const ctrl = require('./content-element.controller');
const processQuery = require('../shared/util/processListQuery')();
const { middleware: sse } = require('../shared/sse');
const router = require('express').Router();

router.route('/')
  .get(processQuery, ctrl.list)
  .post(ctrl.create);

router.get('/subscribe', sse, createFeed);

router.route('/:elementId')
  .get(ctrl.show)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

router
  .post('/:elementId/reorder', ctrl.reorder);

function createFeed({ query }, { sse }) {
  sse.join(query.repositoryId);
}

module.exports = {
  path: '/content-elements',
  router
};
