'use strict';

const { createError } = require('../shared/error/helpers');
const editorService = require('./editor.service');
const { subscribe, broadcast } = require('./channel');
const { middleware: sse } = require('../shared/util/sse');
const { NOT_FOUND } = require('http-status-codes');
const pick = require('lodash/pick');
const router = require('express-promise-router')();
const { User } = require('../shared/database');

router
  .route('/courses/:courseId/activities/:activityId/editors/subscribe')
  .all(mapParameters)
  .get(sse, mapEditors, subscribe)
  .post(mapEditor, add, broadcastUpdate);

router.post(
  '/courses/:courseId/activities/:activityId/editors/unsubscribe',
  mapParameters,
  mapEditor,
  remove,
  broadcastUpdate
);

function mapParameters(req, res, next) {
  const { courseId, activityId } = req.params;
  req.courseId = Number(courseId);
  req.activityId = Number(activityId);
  next();
}

function mapEditor(req, res, next) {
  const { body } = req;
  const { id: editorId } = body;

  return User.findById(editorId)
    .then(user => user || createError(NOT_FOUND, 'User not found'))
    .then(user => {
      req.editor = pick(user, ['id', 'email']);
      next();
    });
}

function mapEditors(req, res, next) {
  const { courseId, activityId } = req;
  req.editors = getCurrentEditors(courseId, activityId);
  next();
}

function add({ editor, courseId, activityId }, res, next) {
  editorService.addEditor(editor, courseId, activityId);
  next();
}

function remove({ editor, courseId, activityId }, res, next) {
  editorService.removeEditor(editor, courseId, activityId);
  next();
}

function broadcastUpdate({ courseId, activityId }, res) {
  broadcast(
    { courseId, activityId, payload: getCurrentEditors(courseId, activityId) }
  );
  res.status(200).end();
}

function getCurrentEditors(courseId, activityId) {
  return editorService.getEditors(courseId, activityId);
}

module.exports = {
  router
};
