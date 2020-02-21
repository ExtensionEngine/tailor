'use strict';

const { Activity, ContentElement } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const { Op } = require('sequelize');
const pick = require('lodash/pick');

function list({ query, opts }, res) {
  if (!query.detached) opts.where = { detached: false };
  if (query.ids) {
    const ids = query.ids.map(id => Number(id));
    const cond = { [Op.in]: ids };
    const where = { [Op.or]: [{ id: cond }, { parentId: cond }] };
    opts.include = { model: Activity, attributes: [], where };
  }

  return ContentElement.fetch(opts)
    .then(data => res.json({ data }));
}

function show({ params }, res) {
  const id = parseInt(params.elementId, 10);
  return ContentElement.fetch(id)
    .then(asset => asset || createError(NOT_FOUND, 'Element not found'))
    .then(asset => res.json({ data: asset }));
}

function create({ user, repository, body }, res) {
  const attr = ['activityId', 'type', 'data', 'position', 'refs'];
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
    .then(asset => asset.update(data, { context }))
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

module.exports = {
  list,
  show,
  create,
  patch,
  remove,
  reorder
};
