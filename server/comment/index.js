const { Comment } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const ctrl = require('./comment.controller');
const model = require('./comment.model');
const { FORBIDDEN, NOT_FOUND } = require('http-status-codes');
const processQuery = require('../shared/util/processListQuery');
const router = require('express-promise-router')();
const { User } = require('../shared/database');

const defaultListQuery = {
  order: [['createdAt', 'DESC']],
  paranoid: false
};

router
  .route('/courses/:courseId/activities/:activityId/comments')
  .get(processQuery(defaultListQuery), ctrl.list)
  .post(ctrl.create);

router
  .route('/courses/:courseId/activities/:activityId/comments/:commentId')
  .all(getComment)
  .get(ctrl.show)
  .patch(canEdit, ctrl.patch)
  .delete(canEdit, ctrl.remove);

function getComment(req, res) {
  const include = [{ model: User, attributes: ['id', 'email'] }];
  return Comment.findById(req.params.commentId, { paranoid: false, include })
    .then(comment => comment || createError(NOT_FOUND, 'Comment not found'))
    .then(comment => {
      req.comment = comment;
      return Promise.resolve('next');
    });
}

function canEdit({ user, comment }) {
  if (user.id !== comment.userId) return createError(FORBIDDEN, 'Forbidden');
  return Promise.resolve('next');
}

module.exports = {
  model,
  router
};
