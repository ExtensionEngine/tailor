'use strict';

const { FORBIDDEN, NOT_FOUND } = require('http-status-codes');
const channel = require('./channel');
const { Comment } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const ctrl = require('./comment.controller');
const { middleware: sse } = require('../shared/util/sse');
const processQuery = require('../shared/util/processListQuery');
const router = require('express').Router();
const { User } = require('../shared/database');

const defaultListQuery = {
  order: [['createdAt', 'DESC']],
  paranoid: false
};

router.get('/subscribe', sse, channel.subscribe);

router.param('commentId', getComment);

router.route('/')
  .get(processQuery(defaultListQuery), ctrl.list)
  .post(ctrl.create);

router.route('/:commentId')
  .patch(canEdit, ctrl.patch)
  .delete(canEdit, ctrl.remove);

function getComment(req, _res, next, commentId) {
  const include = [{ model: User, as: 'author', attributes: ['id', 'email'] }];
  return Comment.findByPk(commentId, { paranoid: false, include })
    .then(comment => comment || createError(NOT_FOUND, 'Comment not found'))
    .then(comment => {
      req.comment = comment;
      next();
    });
}

function canEdit({ user, comment }, _res, next) {
  if (user.id !== comment.authorId) return createError(FORBIDDEN, 'Forbidden');
  next();
}

module.exports = {
  path: '/comments',
  router
};
