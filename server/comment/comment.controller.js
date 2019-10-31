'use strict';

const { Comment, Course, User } = require('../shared/database');

function list({ opts, query }, res) {
  const { courseId, activityId } = query;
  if (!courseId) return [];
  const include = [{ model: User, as: 'author', attributes: ['id', 'email'] }];
  if (activityId) (opts.where.activityId = activityId);
  return Course.findByPk(courseId)
    .then(course => course.getComments({ ...opts, include }))
    .then(data => res.json({ data }));
}

function show({ comment }, res) {
  return res.json({ data: comment });
}

function create({ body, user }, res) {
  const { content, activityId, courseId } = body;
  const authorId = user.id;
  return Comment.create({ content, activityId, courseId, authorId })
    .then(data => res.json({ data }));
}

function patch({ comment, body }, res) {
  const { content } = body;
  return comment.update({ content })
    .then(data => res.json({ data }));
}

function remove({ comment }, res) {
  return comment.destroy()
    .then(data => res.json({ data }));
}

module.exports = {
  list,
  show,
  create,
  patch,
  remove
};
