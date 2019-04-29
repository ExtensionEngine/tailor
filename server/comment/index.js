'use strict';

const channel = require('./channel');
const { Comment } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const ctrl = require('./comment.controller');
const { FORBIDDEN, NOT_FOUND } = require('http-status-codes');
const model = require('./comment.model');
const processQuery = require('../shared/util/processListQuery');
const { middleware: sse } = require('../shared/util/sse');
const router = require('express-promise-router')();
const { User } = require('../shared/database');

const defaultListQuery = {
  order: [['createdAt', 'DESC']],
  paranoid: false
};

router.get('/courses/:courseId/comments/subscribe', sse, channel.subscribe);

router
  .route('/courses/:courseId/comments')
  .get(processQuery(defaultListQuery), ctrl.list)
  .post(ctrl.create);

router
  .post('/courses/:courseId/comments/email', ctrl.email);

router
  .route('/courses/:courseId/comments/:commentId')
  .all(getComment)
  .get(ctrl.show)
  .patch(canEdit, ctrl.patch)
  .delete(canEdit, ctrl.remove);

function getComment(req, res) {
  const include = [{ model: User, as: 'author', attributes: ['id', 'email'] }];
  return Comment.findByPk(req.params.commentId, { paranoid: false, include })
    .then(comment => comment || createError(NOT_FOUND, 'Comment not found'))
    .then(comment => {
      req.comment = comment;
      return Promise.resolve('next');
    });
}

function canEdit({ user, comment }) {
  if (user.id !== comment.authorId) return createError(FORBIDDEN, 'Forbidden');
  return Promise.resolve('next');
}

module.exports = {
  model,
  router
};
