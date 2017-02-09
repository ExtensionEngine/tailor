'use strict';

const { Asset } = require('../shared/database/sequelize');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const pick = require('lodash/pick');

function list(req, res) {
  // TODO: Temporary returns all course assets;
  // switch to per activity
  return req.course.getAssets()
    .then(assets => res.json({ data: assets }));
}

function show({ params }, res) {
  return Asset
    .findByIdAndFetch(params.assetId)
    .then(asset => asset || createError(NOT_FOUND, 'Asset not found'))
    .then(asset => res.json({ data: asset }));
}

function create({ body, params }, res) {
  const attr = ['activityId', 'type', 'data', 'position', 'layoutWidth'];
  const data = Object.assign(pick(body, attr), { courseId: params.courseId });
  return Asset
    .initialize()
    .then(asset => asset.saveAndUpload(data))
    .then(asset => res.json({ data: asset }));
}

function patch({ body, params }, res) {
  return Asset.findById(params.assetId)
    .then(asset => asset || createError(NOT_FOUND, 'Asset not found'))
    .then(asset => asset.saveAndUpload(body))
    .then(asset => res.json({ data: asset }));
}

function remove({ params }, res) {
  return Asset.findById(params.assetId)
    .then(asset => asset || createError(NOT_FOUND, 'Asset not found'))
    .then(asset => asset.destroyWithRemote())
    .then(() => res.end());
}

module.exports = {
  list,
  show,
  create,
  patch,
  remove
};
