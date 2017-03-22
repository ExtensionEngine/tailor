'use strict';

const { TeachingElement, Activity } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const pick = require('lodash/pick');
const processListQuery = require('../shared/util/processListQuery');

function list({ course, query }, res) {
  const opts = processListQuery(query);

  if (query.activityId || query.parentId) {
    const { activityId, parentId } = query;
    const where = { $or: [] };
    if (activityId) where.$or.push({ id: parseInt(activityId, 10) });
    if (parentId) where.$or.push({ parentId: parseInt(parentId, 10) });
    opts.include = { model: Activity, attributes: [], where };
  }

  const elements = query.integration
    ? course.getTeachingElements(opts)
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
  const attr = ['activityId', 'type', 'data', 'position'];
  const data = Object.assign(pick(body, attr), { courseId: params.courseId });
  return TeachingElement.initialize()
    .then(asset => asset.update(data, { context: { userId: user.id } }))
    .then(asset => res.json({ data: asset }));
}

function patch({ body, params, user }, res) {
  return TeachingElement.findById(params.teId)
    .then(asset => asset || createError(NOT_FOUND, 'TEL not found'))
    .then(asset => asset.update(body, { context: { userId: user.id } }))
    .then(asset => res.json({ data: asset }));
}

function remove({ params, user }, res) {
  return TeachingElement.findById(params.teId)
    .then(asset => asset || createError(NOT_FOUND, 'TEL not found'))
    .then(asset => asset.destroy({ context: { userId: user.id } }))
    .then(() => res.end());
}

function reorder({ body, params }, res) {
  return TeachingElement.findById(params.teId)
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
