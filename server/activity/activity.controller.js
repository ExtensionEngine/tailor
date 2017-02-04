'use strict';

const { Activity } = require('../shared/database/sequelize');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const pick = require('lodash/pick');

function create({ body, params }, res) {
  const attrs = ['name', 'parentId', 'position'];
  return Activity
    .create(Object.assign(pick(body, attrs), { courseId: params.courseId }))
    .then(activity => res.json({ data: activity }));
}

function show({ params }, res) {
  return Activity
    .findById(params.activityId)
    .then(activity => activity || createError(NOT_FOUND, 'Activity not found'))
    .then(activity => res.json({ data: activity }));
}

function patch({ params, body }, res) {
  return Activity
    .findById(params.activityId)
    .then(activity => activity || createError(NOT_FOUND, 'Activity not found'))
    .then(activity => activity.update(body))
    .then(activity => res.json({ data: activity }));
}

function list(req, res) {
  return req.course.getActivities({ order: 'position ASC' })
    .then(activities => res.json({ data: activities }));
}

function remove({ params }, res) {
  return Activity
    .findById(params.activityId)
    .then(activity => activity.remove())
    .then(activity => res.json({ data: pick(activity, ['id']) }));
}

function reorder({ body, params }, res) {
  return Activity
    .findById(params.activityId)
    .then(activity => activity.reorder(body.position))
    .then(activity => res.json({ data: activity }));
}

module.exports = {
  create,
  show,
  list,
  patch,
  remove,
  reorder
};
