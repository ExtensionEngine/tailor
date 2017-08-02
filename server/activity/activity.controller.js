'use strict';

const { Activity } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const pick = require('lodash/pick');
const processQuery = require('../shared/util/processListQuery');

function create({ body, params, user }, res) {
  const attrs = ['name', 'type', 'parentId', 'position'];
  const data = Object.assign(pick(body, attrs), { courseId: params.courseId });
  const opts = { context: { userId: user.id } };
  return Activity.create(data, opts)
    .then(activity => res.json({ data: activity }));
}

function show({ params }, res) {
  return Activity.findById(params.activityId)
    .then(activity => activity || createError(NOT_FOUND, 'Activity not found'))
    .then(activity => res.json({ data: activity }));
}

function patch({ body, params, user }, res) {
  return Activity.findById(params.activityId)
    .then(activity => activity || createError(NOT_FOUND, 'Activity not found'))
    .then(activity => activity.update(body, { context: { userId: user.id } }))
    .then(activity => res.json({ data: activity }));
}

function list({ course, query }, res) {
  const opts = processQuery(query.integration ? query : { sortBy: 'position' });
  if (!query.detached) opts.where.$and = [{ detached: false }];
  return course.getActivities(opts).then(data => res.json({ data }));
}

function remove({ params, user }, res) {
  const options = {
    recursive: true,
    soft: true,
    context: { userId: user.id }
  };
  return Activity.findById(params.activityId)
    .then(activity => activity.remove(options))
    .then(activity => res.json({ data: pick(activity, ['id']) }));
}

function reorder({ body, params }, res) {
  return Activity.findById(params.activityId)
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
