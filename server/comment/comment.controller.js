import { BAD_REQUEST, NO_CONTENT } from 'http-status-codes';
import { createError } from '../shared/error/helpers.js';
import db from '../shared/database/index.js';
import pick from 'lodash/pick.js';
import pickBy from 'lodash/pickBy.js';

const { Comment, ContentElement, User } = db;

const author = {
  model: User,
  as: 'author',
  attributes: ['id', 'email', 'firstName', 'lastName', 'fullName', 'label', 'imgUrl']
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
  return comment.update({ content, editedAt: new Date() })
    .then(comment => comment.reload({ include: [author] }))
    .then(data => res.json({ data }));
}

function remove({ comment }, res) {
  return comment.destroy()
    .then(data => res.json({ data }));
}

function updateResolvement({ repository, body }, res) {
  const { id, resolvedAt, contentElementId } = body;
  if (!contentElementId && !id) {
    return createError(BAD_REQUEST, 'id or contentElementId required!');
  }
  const { id: repositoryId } = repository;
  const where = pickBy({ id, repositoryId, contentElementId }, val => !!val);
  const data = { resolvedAt: resolvedAt ? null : new Date() };
  return Comment.update(data, { where, paranoid: false })
    .then(() => res.sendStatus(NO_CONTENT));
}

export default {
  list,
  create,
  patch,
  remove,
  updateResolvement
};
