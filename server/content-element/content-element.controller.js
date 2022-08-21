import { Activity, ContentElement } from '../shared/database/index.js';
import { createError } from '../shared/error/helpers.js';
import { NOT_FOUND } from 'http-status-codes';
import pick from 'lodash/pick.js';

function list({ query, opts }, res) {
  const { detached, ids } = query;
  if (!detached) opts.where = { detached: false };
  if (ids) {
    const where = { id: ids.map(Number) };
    opts.include = { model: Activity, attributes: [], where };
  }

  return ContentElement.fetch(opts).then(data => res.json({ data }));
}

function show({ params }, res) {
  const id = parseInt(params.elementId, 10);
  return ContentElement.fetch(id)
    .then(asset => asset || createError(NOT_FOUND, 'Element not found'))
    .then(asset => res.json({ data: asset }));
}

function create({ user, repository, body }, res) {
  const attr = ['uid', 'activityId', 'type', 'data', 'position', 'refs'];
  const data = { ...pick(body, attr), repositoryId: repository.id };
  const context = { userId: user.id, repository };
  return ContentElement.create(data, { context })
    .then(asset => res.json({ data: asset }));
}

function patch({ repository, user, body, params: { elementId } }, res) {
  const attrs = ['type', 'data', 'position', 'meta', 'refs', 'deletedAt'];
  const data = pick(body, attrs);
  const paranoid = body.paranoid !== false;
  const context = { userId: user.id, repository };
  return ContentElement.findByPk(elementId, { paranoid })
    .then(asset => asset || createError(NOT_FOUND, 'Element not found'))
    .then(asset => {
      if (asset.deletedAt) asset.setDataValue('deletedAt', null);
      return asset.update(data, { context });
    })
    .then(asset => res.json({ data: asset }));
}

function remove({ repository, user, params: { elementId } }, res) {
  const context = { userId: user.id, repository };
  return ContentElement.findByPk(elementId)
    .then(asset => asset || createError(NOT_FOUND, 'Element not found'))
    .then(asset => asset.destroy({ context }))
    .then(() => res.end());
}

function reorder({ body, params: { elementId } }, res) {
  return ContentElement.findByPk(elementId)
    .then(asset => asset.reorder(body.position))
    .then(asset => res.json({ data: asset }));
}

export default {
  list,
  show,
  create,
  patch,
  remove,
  reorder
};
