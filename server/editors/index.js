'use strict';

const { createError } = require('../shared/error/helpers');
const { events, subscribe, broadcast } = require('./channel');
const { middleware: sse } = require('../shared/util/sse');
const { NOT_FOUND } = require('http-status-codes');
const router = require('express-promise-router')();
const storageService = require('./storage.service');
const { User } = require('../shared/database');

router
  .route('/courses/:courseId/editors/subscribe')
  .all(mapParameters)
  .get(sse, subscribe)
  .post(mapEditor, add);

router.post(
  '/courses/:courseId/editors/unsubscribe',
  mapParameters,
  mapEditor,
  remove
);

router.get(
  '/courses/:courseId/editors',
  mapParameters,
  show
);

function mapParameters(req, res) {
  const { courseId } = req.params;
  const activityId = req.query.activityId || req.body.activityId;

  req.courseId = Number(courseId);
  if (activityId) req.activityId = Number(activityId);

  return Promise.resolve('next');
}

function mapEditor(req, res) {
  const { body } = req;
  const { editorId, activityId } = body;

  return User.findById(editorId)
    .then(user => user || createError(NOT_FOUND, 'User not found'))
    .then(user => {
      req.editor = { id: user.id, email: user.email, activityId };
      return Promise.resolve('next');
    });
}

function show({courseId, activityId}, res) {
  return getCurrentEditors(courseId, activityId)
    .then(editors => Promise.resolve(res.json({ data: editors })));
}

function add({ editor, courseId, activityId }, res) {
  return storageService.storeEditorId(editor.id, courseId, activityId)
    .then(() => {
      broadcast(events.ADD, { courseId, activityId, editor });
      res.status(200).end();
    });
}

function remove({ editor, courseId, activityId }, res) {
  return storageService.removeEditorId(editor.id, courseId, activityId)
    .then(() => {
      broadcast(events.REMOVE, { courseId, activityId, editor });
      res.status(200).end();
    });
}

function getCurrentEditors(courseId, activityId) {
  return storageService.getEditorIds(courseId, activityId)
    .then(editorIds => User.findAll({
      attributes: [ 'id', 'email' ],
      where: { id: editorIds }
    }))
    .then(users => {
      let editors = users.map(user => ({
        id: user.id,
        email: user.email,
        activityId
      }));
      return Promise.resolve(editors);
    });
}

module.exports = {
  router
};
