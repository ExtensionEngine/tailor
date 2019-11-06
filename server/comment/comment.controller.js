'use strict';

const { Comment, User } = require('../shared/database');

function list({ repository, opts, query }, res) {
  const include = [{ model: User, as: 'author', attributes: ['id', 'email'] }];
  if (query.activityId) {
    opts.where.activityId = query.activityId;
  }
  return repository.getComments({ ...opts, include })
    .then(data => res.json({ data }));
}

function show({ comment }, res) {
  return res.json({ data: comment });
}

function create({ user, repository, body }, res) {
  const { content, activityId } = body;
  const { id: repositoryId } = repository;
  return Comment.create({ content, activityId, repositoryId, authorId: user.id })
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
