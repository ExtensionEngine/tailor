'use strict';

const { Comment } = require('../shared/database');
const { User } = require('../shared/database');

function list({ course, opts, query }, res) {
  const include = [{ model: User, as: 'author', attributes: ['id', 'email'] }];
  if (query.activityId) {
    opts.where.activityId = query.activityId;
  }
  return course.getComments({ ...opts, include })
    .then(data => res.jsend.success(data));
}

function show({ comment }, res) {
  return res.jsend.success(comment);
}

function create({ body, params, user }, res) {
  const { content, activityId } = body;
  const { courseId } = params;
  const authorId = user.id;
  return Comment.create({ content, activityId, courseId, authorId })
    .then(data => res.jsend.success(data));
}

function patch({ comment, body }, res) {
  const { content } = body;
  return comment.update({ content })
    .then(data => res.jsend.success(data));
}

function remove({ comment }, res) {
  return comment.destroy()
    .then(data => res.jsend.success(data));
}

module.exports = {
  list,
  show,
  create,
  patch,
  remove
};
