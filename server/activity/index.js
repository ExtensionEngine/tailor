'use strict';

const { Activity } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const ctrl = require('./activity.controller');
const model = require('./activity.model');
const { NOT_FOUND } = require('http-status-codes');
const processListQuery = require('../shared/util/processListQuery');
const router = require('express').Router();

const processQuery = processListQuery({ order: [['position']] });

router
  .param('activityId', getActivity)
  .get('/courses/:courseId/activities', processQuery, ctrl.list)
  .post('/courses/:courseId/activities', ctrl.create)
  .get('/courses/:courseId/activities/:activityId', ctrl.show)
  .patch('/courses/:courseId/activities/:activityId', ctrl.patch)
  .delete('/courses/:courseId/activities/:activityId', ctrl.remove)
  .post('/courses/:courseId/activities/:activityId/reorder', ctrl.reorder)
  .post('/courses/:courseId/activities/:activityId/clone', ctrl.clone)
  .get('/courses/:courseId/activities/:activityId/publish', ctrl.publish)
  .get('/courses/:courseId/activities/:activityId/preview', ctrl.getPreviewUrl);

function getActivity(req, _res, next, activityId) {
  return Activity.findByPk(activityId, { paranoid: false })
    .then(activity => activity || createError(NOT_FOUND, 'Activity not found'))
    .then(activity => {
      req.activity = activity;
      next();
    });
}

module.exports = {
  model,
  router
};
