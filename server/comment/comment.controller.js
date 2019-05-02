'use strict';

const { Activity, Comment, User } = require('../shared/database');
const { Op } = require('sequelize');
const mail = require('../shared/mail');

function list({ course, opts, query }, res) {
  const include = [{ model: User, as: 'author', attributes: ['id', 'email'] }];
  if (query.activityId) {
    opts.where.activityId = query.activityId;
  }
  if (query.limit && query.offset) {
    const { limit, offset } = query;
    opts.limit = limit;
    opts.offset = offset;
  }
  return course.getComments({ ...opts, include })
    .then(data => res.json({ data }));
}

function email({ course, body }, res) {
  const include = [
    { model: User, as: 'author', attributes: ['id', 'email'] },
    { model: Activity, as: 'activity', attributes: ['id', 'type', 'data'] }
  ];
  const { since, email } = body;
  let date = new Date();
  date.setDate(date.getDate() - since);
  const opts = {
    order: [['createdAt', 'DESC']],
    where: { createdAt: { [Op.gt]: date } }
  };
  return course.getComments({ ...opts, include })
    .then(comments => Comment.sortComments({ comments, schema: course.schema }))
    .then(comments => mail.commentsList({ email, comments, since }))
    .then(() => res.end());
}

function show({ comment }, res) {
  return res.json({ data: comment });
}

function create({ body, params, user }, res) {
  const { content, activityId } = body;
  const { courseId } = params;
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
  remove,
  email
};
