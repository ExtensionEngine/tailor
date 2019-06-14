'use strict';

const { Revision, User } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const ctrl = require('./revision.controller');
const { NOT_FOUND } = require('http-status-codes');
const router = require('express').Router();

router
  .param('revisionId', getRevision)
  .get('/courses/:id/revisions', ctrl.index)
  .get('/courses/:id/revisions/:revisionId', ctrl.resolve)
  .post('/courses/:id/revisions/:revisionId/restore', ctrl.restore);

function getRevision(req, _res, next, revisionId) {
  const include = [{ model: User, attributes: ['id', 'email'] }];
  return Revision.findByPk(revisionId, { include })
    .then(revision => revision || createError(NOT_FOUND, 'Revision not found'))
    .then(revision => {
      req.revision = revision;
      next();
    });
}

module.exports = {
  controller: ctrl,
  router
};
