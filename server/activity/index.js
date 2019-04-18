'use strict';

const { Activity } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const ctrl = require('./activity.controller');
const model = require('./activity.model');
const { NOT_FOUND } = require('http-status-codes');
const processListQuery = require('../shared/util/processListQuery');
const router = require('express-promise-router')();

const processQuery = processListQuery({ order: [['position']] });

router
  .use('/courses/:courseId/activities/:activityId*', getActivity)
  .get('/courses/:courseId/activities', processQuery, ctrl.list)
  .post('/courses/:courseId/activities', ctrl.create)
  .get('/courses/:courseId/activities/:activityId', ctrl.show)
  .patch('/courses/:courseId/activities/:activityId', ctrl.patch)
  .delete('/courses/:courseId/activities/:activityId', ctrl.remove)
  .post('/courses/:courseId/activities/:activityId/reorder', ctrl.reorder)
  .post('/courses/:courseId/activities/:activityId/clone', ctrl.clone)
  .get('/courses/:courseId/activities/:activityId/publish', ctrl.publish);

function getActivity(req, res) {
  return Activity.findByPk(req.params.activityId, { paranoid: false })
    .then(activity => activity || createError(NOT_FOUND, 'Activity not found'))
    .then(activity => {
      req.activity = activity;
      return Promise.resolve('next');
    });
}

module.exports = {
  model,
  router
};
