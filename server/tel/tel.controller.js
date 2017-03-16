'use strict';

const { Tel, Activity } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const pick = require('lodash/pick');

function list({ query }, res) {
  const parentId = parseInt(query.parentId, 10);
  const include = [{ model: Activity, attributes: [], where: { parentId } }];
  return Tel.fetch({ include })
    .then(assets => res.json({ data: assets }));
}

function show({ params }, res) {
  const telId = parseInt(params.telId, 10);
  return Tel.fetch(telId)
    .then(asset => asset || createError(NOT_FOUND, 'TEL not found'))
    .then(asset => res.json({ data: asset }));
}

function create({ body, params, user }, res) {
  const attr = ['activityId', 'type', 'data', 'position'];
  const data = Object.assign(pick(body, attr), { courseId: params.courseId });
  return Tel.initialize()
    .then(asset => asset.update(data, { context: { userId: user.id } }))
    .then(asset => res.json({ data: asset }));
}

function patch({ body, params, user }, res) {
  return Tel.findById(params.telId)
    .then(asset => asset || createError(NOT_FOUND, 'TEL not found'))
    .then(asset => asset.update(body, { context: { userId: user.id } }))
    .then(asset => res.json({ data: asset }));
}

function remove({ params, user }, res) {
  return Tel.findById(params.telId)
    .then(asset => asset || createError(NOT_FOUND, 'TEL not found'))
    .then(asset => asset.destroy({ context: { userId: user.id } }))
    .then(() => res.end());
}

function reorder({ body, params }, res) {
  return Tel.findById(params.telId)
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
