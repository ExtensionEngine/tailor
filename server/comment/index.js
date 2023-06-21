import { FORBIDDEN, NOT_FOUND } from 'http-status-codes';
import { createError } from '../shared/error/helpers.js';
import ctrl from './comment.controller.js';
import db from '../shared/database/index.js';
import express from 'express';
import processQuery from '../shared/util/processListQuery.js';

const { Comment, Sequelize, User } = db;
const router = express.Router();
const { EmptyResultError } = Sequelize;

const defaultListQuery = {
  order: [['createdAt', 'DESC']],
  paranoid: false
};

router.param('commentId', getComment);

router.route('/')
  .get(processQuery(defaultListQuery), ctrl.list)
  .post(ctrl.create);

router.route('/:commentId')
  .patch(canEdit, ctrl.patch)
  .delete(canEdit, ctrl.remove);

router.post('/resolve', ctrl.updateResolvement);

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

export default {
  path: '/comments',
  router
};
