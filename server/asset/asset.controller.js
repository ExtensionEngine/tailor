'use strict';

const { Asset } = require('../shared/database/sequelize');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const pick = require('lodash/pick');

function list({ query }, res) {
  return Asset
    .findAllByActivity(query.activityId)
    .then(activities => res.json({ data: Asset.serializeMany(activities) }));
}

function show({ params }, res) {
  return Asset
    .findById(params.assetId)
    .then(asset => asset || createError(NOT_FOUND, 'Asset not found'))
    .then(asset => res.json({ data: asset.serialize() }));
}

function create({ body }, res) {
  const fields = ['layoutWidth', 'position', 'type', 'data', 'courseId', 'parentId'];
  return Asset
    .create(pick(body, fields))
    .then(asset => res.json({ data: asset.serialize() }));
}

function patch({ body, params }, res) {
  return Asset
    .updateById(params.assetId, body)
    .then(asset => asset || createError(NOT_FOUND, 'Asset not found'))
    .then(asset => res.json({ data: asset.serialize() }));
}

function remove({ params }, res) {
  return Asset
    .deleteById(params.assetId)
    .asset(asset => asset || createError(NOT_FOUND, 'Asset not found'))
    .then(asset => res.json({ data: asset.serialize() }));
}

module.exports = {
  list,
  show,
  create,
  patch,
  remove
};
