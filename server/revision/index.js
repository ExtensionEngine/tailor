import { createError } from '../shared/error/helpers.js';
import ctrl from './revision.controller.js';
import db from '../shared/database/index.js';
import defaultsDeep from 'lodash/defaultsDeep.js';
import express from 'express';
import { NOT_FOUND } from 'http-status-codes';
import pick from 'lodash/pick.js';
import processListQuery from '../shared/util/processListQuery.js';

const { Revision, User } = db;

const router = express.Router();
const defaultListQuery = { order: [['createdAt', 'DESC']] };

router.param('revisionId', getRevision);

router
  .get('/time-travel', processQuery({ elementIds: [] }), ctrl.getStateAtMoment)
  .get('/', processListQuery(defaultListQuery), ctrl.index)
  .get('/:revisionId', ctrl.get);

function getRevision(req, _res, next, revisionId) {
  const id = parseInt(revisionId, 10);
  const include = [{ model: User, attributes: ['id', 'email'] }];
  return Revision.fetch(id, { include })
    .then(revision => revision || createError(NOT_FOUND, 'Revision not found'))
    .then(revision => {
      req.revision = revision;
      next();
    });
}

export default {
  path: '/revisions',
  router
};

function processQuery(defaults) {
  return (req, res, next) => {
    const params = ['activityId', 'elementIds', 'timestamp'];
    const query = defaultsDeep({}, pick(req.query, params), defaults);
    if (query.elementIds) {
      query.elementIds = query.elementIds.map(Number);
    }
    req.query = query;
    next();
  };
}
