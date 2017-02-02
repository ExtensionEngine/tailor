'use strict';

const { Asset } = require('../shared/database/sequelize');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const pick = require('lodash/pick');

function list({ query }, res) {
  return Asset
    .findAllByActivity(query.activityId)
    .then(assets => res.json({ data: assets }));
}

function show({ params }, res) {
  return Asset
    .findById(params.assetId)
    .then(asset => asset || createError(NOT_FOUND, 'Asset not found'))
    .then(asset => res.json({ data: asset }));
}

function create({ body }, res) {
  const fields = ['layoutWidth', 'position', 'type', 'data', 'courseId', 'activityId'];
  return Asset
    .create(pick(body, fields))
    .then(asset => res.json({ data: asset }));
}

function patch({ body, params }, res) {
  return Asset
    .updateById(params.assetId, body)
    .then(asset => asset || createError(NOT_FOUND, 'Asset not found'))
    .then(asset => res.json({ data: asset }));
}

function remove({ params }, res) {
  return Asset
    .deleteById(params.assetId)
    .then(asset => asset || createError(NOT_FOUND, 'Asset not found'))
    .then(asset => res.json({ data: asset }));
}

module.exports = {
  list,
  show,
  create,
  patch,
  remove
};
