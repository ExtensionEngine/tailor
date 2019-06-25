'use strict';

const { Activity, TeachingElement } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const { Op } = require('sequelize');
const { resolveStatics } = require('../shared/storage/helpers');
const pick = require('lodash/pick');

function list({ course, query, opts }, res) {
  if (query.activityId || query.parentId) {
    const { activityId, parentId } = query;
    const where = { [Op.or]: [] };
    if (activityId) where[Op.or].push({ id: parseInt(activityId, 10) });
    if (parentId) where[Op.or].push({ parentId: parseInt(parentId, 10) });
    opts.include = { model: Activity, attributes: [], where };
  }
  if (!query.detached) opts.where = { detached: false };

  const elements = query.integration
    ? course.getTeachingElements(opts)
    : TeachingElement.fetch(opts);
  return elements.then(data => res.jsend.success(data));
}

function show({ params }, res) {
  const teId = parseInt(params.teId, 10);
  return TeachingElement.fetch(teId)
    .then(asset => asset || createError(NOT_FOUND, 'TEL not found'))
    .then(asset => res.jsend.success(asset));
}

function create({ body, params, user }, res) {
  const attr = ['activityId', 'type', 'data', 'position', 'refs'];
  const data = Object.assign(pick(body, attr), { courseId: params.courseId });
  return TeachingElement.create(data, { context: { userId: user.id } })
    .then(asset => resolveStatics(asset))
    .then(asset => res.jsend.success(asset));
}

function patch({ body, params, user }, res) {
  const attrs = ['refs', 'type', 'data', 'meta', 'position', 'courseId', 'deletedAt'];
  const data = pick(body, attrs);
  const paranoid = body.paranoid !== false;
  return TeachingElement.findByPk(params.teId, { paranoid })
    .then(asset => asset || createError(NOT_FOUND, 'TEL not found'))
    .then(asset => asset.update(data, { context: { userId: user.id } }))
    .then(asset => resolveStatics(asset))
    .then(asset => res.jsend.success(asset));
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
    .then(asset => res.jsend.success(asset));
}

module.exports = {
  list,
  show,
  create,
  patch,
  remove,
  reorder
};
