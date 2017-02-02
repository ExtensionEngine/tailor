'use strict';

const { Activity } = require('../shared/database/sequelize');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const pick = require('lodash/pick');

function create({ body }, res) {
  return Activity
    .create(pick(body, ['name', 'parentId', 'courseId', 'position']))
    .then(activity => res.json({ data: activity }));
}

function show({ params }, res) {
  return Activity
    .findById(params.activityId)
    .then(activity => activity || createError(NOT_FOUND, 'Activity not found'))
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
  remove,
  reorder
};
