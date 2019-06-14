'use strict';

const { Revision, User } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const ctrl = require('./revision.controller');
const { NOT_FOUND } = require('http-status-codes');
const router = require('express').Router();

router.param('revisionId', getRevision);

router
  .get('/', ctrl.index)
  .get('/:revisionId', ctrl.resolve);

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
  path: '/revisions',
  router
};
