'use strict';

const { Comment, Sequelize, User } = require('../shared/database');
const { FORBIDDEN, NOT_FOUND } = require('http-status-codes');
const { createError } = require('../shared/error/helpers');
const ctrl = require('./comment.controller');
const processQuery = require('../shared/util/processListQuery');
const { middleware: sse } = require('../shared/sse');
const router = require('express').Router();
const { EmptyResultError } = Sequelize;

const defaultListQuery = {
  order: [['createdAt', 'DESC']],
  paranoid: false
};

router.get('/subscribe', sse, createFeed);

router.param('commentId', getComment);

router.route('/')
  .get(processQuery(defaultListQuery), ctrl.list)
  .post(ctrl.create);

router.route('/:commentId')
  .patch(canEdit, ctrl.patch)
  .delete(canEdit, ctrl.remove);

function createFeed({ query }, { sse }) {
  sse.join(query.repositoryId);
}

function getComment(req, _res, next, commentId) {
  const include = [{
    model: User,
    as: 'author',
    attributes: ['id', 'email', 'firstName', 'lastName', 'fullName', 'imgUrl']
  }];
  const options = { include, paranoid: false, rejectOnEmpty: true };
  return Comment.findByPk(commentId, options)
    .catch(EmptyResultError, () => createError(NOT_FOUND, 'Comment not found'))
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
