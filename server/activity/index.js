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
  .get('/repositories/:repositoryId/activities', processQuery, ctrl.list)
  .post('/repositories/:repositoryId/activities', ctrl.create)
  .get('/repositories/:repositoryId/activities/:activityId', ctrl.show)
  .patch('/repositories/:repositoryId/activities/:activityId', ctrl.patch)
  .delete('/repositories/:repositoryId/activities/:activityId', ctrl.remove)
  .post('/repositories/:repositoryId/activities/:activityId/reorder', ctrl.reorder)
  .post('/repositories/:repositoryId/activities/:activityId/clone', ctrl.clone)
  .get('/repositories/:repositoryId/activities/:activityId/publish', ctrl.publish)
  .get('/repositories/:repositoryId/activities/:activityId/preview', ctrl.getPreviewUrl);

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
