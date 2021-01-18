'use strict';

const { Comment, ContentElement, User } = require('../shared/database');
const { NO_CONTENT } = require('http-status-codes');
const pick = require('lodash/pick');

const author = {
  model: User,
  as: 'author',
  attributes: ['id', 'email', 'label', 'imgUrl']
};

const element = {
  model: ContentElement, as: 'contentElement', attributes: ['uid', 'type']
};

function list({ repository, opts, query }, res) {
  const { activityId, contentElementId } = query;
  if (activityId) opts.where.activityId = activityId;
  if (contentElementId) opts.where.contentElementId = contentElementId;
  return repository.getComments({ ...opts, include: [author, element] })
    .then(data => res.json({ data }));
}

function create({ user, repository: { id: repositoryId }, body }, res) {
  const attrs = ['uid', 'activityId', 'contentElementId', 'content'];
  const payload = { repositoryId, authorId: user.id, ...pick(body, attrs) };
  return Comment.create(payload, { include: [author, element] })
    .then(data => res.json({ data }));
}

function patch({ comment, body }, res) {
  const { content } = body;
  return comment.update({ content })
    .then(comment => comment.reload({ include: [author] }))
    .then(data => res.json({ data }));
}

function remove({ comment }, res) {
  return comment.destroy()
    .then(data => res.json({ data }));
}

async function resolve({ body }, res) {
  const where = { contentElementId: body.contentElementId };
  await Comment.update({ resolved: true }, { where });
  return res.sendStatus(NO_CONTENT);
}

module.exports = {
  list,
  create,
  patch,
  remove,
  resolve
};
