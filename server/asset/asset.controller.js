'use strict';

const { Asset, Activity } = require('../shared/database/sequelize');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const pick = require('lodash/pick');

function list({ query }, res) {
  const parentId = parseInt(query.parentId, 10);
  const include = [{ model: Activity, attributes: [], where: { parentId } }];
  return Asset.findAll({ include })
    .then(assets => res.json({ data: assets }));
}

function show({ params }, res) {
  return Asset.findById(params.assetId)
    .then(asset => asset || createError(NOT_FOUND, 'Asset not found'))
    .then(asset => res.json({ data: asset }));
}

function create({ body, params }, res) {
  const attr = ['activityId', 'type', 'data', 'position', 'layoutWidth'];
  const data = Object.assign(pick(body, attr), { courseId: params.courseId });
  return Asset.create(data)
    .then(asset => res.json({ data: asset }));
}

function patch({ body, params }, res) {
  return Asset.findById(params.assetId)
    .then(asset => asset || createError(NOT_FOUND, 'Asset not found'))
    .then(asset => asset.update(body))
    .then(asset => res.json({ data: asset }));
}

function remove({ params }, res) {
  return Asset.findById(params.assetId)
    .then(asset => asset || createError(NOT_FOUND, 'Asset not found'))
    .then(asset => asset.destroy())
    .then(() => res.end());
}

function reorder({ body, params }, res) {
  return Asset.findById(params.assetId)
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
