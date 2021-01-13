'use strict';

const { Revision, User } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const ctrl = require('./revision.controller');
const { NOT_FOUND } = require('http-status-codes');
const processListQuery = require('../shared/util/processListQuery');
const router = require('express').Router();

router.param('revisionId', getRevision);

const defaultListQuery = {
  order: [['createdAt', 'DESC']]
};

router
  .get('/time-travel', ctrl.getStateByMoment)
  .get('/', processListQuery(defaultListQuery), ctrl.index)
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
