'use strict';

const { Activity, TeachingElement } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const { Op } = require('sequelize');
const pick = require('lodash/pick');

function list({ repository, query, opts }, res) {
  if (!query.detached) opts.where = { detached: false };
  if (query.ids) {
    const ids = query.ids.map(id => Number(id));
    const cond = { [Op.in]: ids };
    const where = { [Op.or]: [{ id: cond }, { parentId: cond }] };
    opts.include = { model: Activity, attributes: [], where };
  }

  const elements = query.integration
    ? repository.getTeachingElements(opts)
    : TeachingElement.fetch(opts);
  return elements.then(data => res.json({ data }));
}

function show({ params }, res) {
  const teId = parseInt(params.teId, 10);
  return TeachingElement.fetch(teId)
    .then(asset => asset || createError(NOT_FOUND, 'TEL not found'))
    .then(asset => res.json({ data: asset }));
}

function create({ body, params, user }, res) {
  const attr = ['activityId', 'type', 'data', 'position', 'refs'];
  const data = Object.assign(pick(body, attr), { repositoryId: params.repositoryId });
  return TeachingElement.create(data, { context: { userId: user.id } })
    .then(asset => res.json({ data: asset }));
}

function patch({ body, params, user }, res) {
  const attrs = ['refs', 'type', 'data', 'meta', 'position', 'repositoryId', 'deletedAt'];
  const data = pick(body, attrs);
  const paranoid = body.paranoid !== false;
  return TeachingElement.findByPk(params.teId, { paranoid })
    .then(asset => asset || createError(NOT_FOUND, 'TEL not found'))
    .then(asset => asset.update(data, { context: { userId: user.id } }))
    .then(asset => res.json({ data: asset }));
}

function remove({ params, user }, res) {
  return TeachingElement.findByPk(params.teId)
    .then(asset => asset || createError(NOT_FOUND, 'TEL not found'))
    .then(asset => asset.destroy({ context: { userId: user.id } }))
    .then(() => res.end());
}

function reorder({ body, params }, res) {
  return TeachingElement.findByPk(params.teId)
    .then(asset => asset.reorder(body.position))
    .then(asset => res.json({ data: asset }));
}

module.exports = {
  list,
  show,
  create,
  patch,
  remove,
  reorder
};
