'use strict';

const { User } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const channel = require('./channel');
const { middleware: sse } = require('../shared/util/sse');
const router = require('express-promise-router')();
const storageService = require('./storage.service');

router.get(
  '/courses/:courseId/activities/:activityId/editors/:editorId/subscribe',
  mapParameters,
  ensureEditor,
  storeEditor,
  sse,
  channel.subscribe
);

router.get(
  '/courses/:courseId/activities/:activityId/editors',
  mapParameters,
  show
);

router.post(
  '/courses/:courseId/activities/:activityId/editors/unsubscribe',
  mapParameters,
  remove
);

function mapParameters(req, res) {
  const { courseId, activityId, editorId } = req.params;
  req.courseId = Number(courseId);
  req.activityId = Number(activityId);
  if (editorId) req.editorId = Number(editorId);
  return Promise.resolve('next');
}

function ensureEditor(req, res) {
  const { activityId, editorId } = req;
  return User.findById(editorId)
    .then(user => user || createError(NOT_FOUND, 'User not found'))
    .then(user => (req.editor = { id: editorId, email: user.email, activityId }))
    .then(() => Promise.resolve('next'));
}

function storeEditor({ courseId, activityId, editorId }, res) {
  return storageService.storeEditorId(editorId, courseId, activityId)
    .then(() => Promise.resolve('next'));
}

function show({courseId, activityId}, res) {
  return storageService.getEditorIds(courseId, activityId)
    .then(editorIds => User.findAll({
      attributes: ['id', 'email'],
      where: { id: editorIds }
    }))
    .then(users => {
      let editors = users.map(user => ({
        id: user.id,
        email: user.email,
        activityId
      }));
      return Promise.resolve(res.json({ data: editors }));
    });
}

function remove({ body, courseId, activityId }, res) {
  const editorId = body.editorId;
  return storageService.removeEditorId(editorId, courseId, activityId)
    .then(() => res.status(200).end());
}

module.exports = {
  router
};
