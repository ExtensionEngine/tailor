const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const { Revision, User } = require('../shared/database');
const ctrl = require('./revision.controller');
const router = require('express-promise-router')();

router.use('/courses/:id/revisions/:revisionId*', getRevision);
router.get('/courses/:id/revisions', ctrl.index);
router.get('/courses/:id/revisions/:revisionId', ctrl.resolve);

function getRevision(req, res) {
  const include = [{ model: User, attributes: ['id', 'email'] }];
  return Revision.findById(req.params.revisionId, { include })
    .then(revision => revision || createError(NOT_FOUND, 'Revision not found'))
    .then(revision => {
      req.revision = revision;
      return Promise.resolve('next');
    });
}

module.exports = {
  controller: ctrl,
  router
};
