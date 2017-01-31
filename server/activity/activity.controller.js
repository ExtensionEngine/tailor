'use strict';

const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const { Activity } = require('../shared/database/sequelize');
// const logger = require('../shared/logger');

function create(req, res) {
  const activity = {
    name: req.body.name,
    type: req.body.type,
    course_id: req.body.courseId,
    parent_id: req.body.parentId,
    position: req.body.position
  };
  Activity
    .create(activity)
    .then(data => res.json({ data }));
}

function show(req, res) {
  const id = req.params.activityId;

  return Activity
    .findById(id)
    .then(activity => activity || createError(NOT_FOUND, 'Activity not found'))
    .then(activity => res.json({ data: activity }));
}

function list(req, res) {
  const courseId = req.params.courseId;

  return Activity
    .findAll({ where: { course_id: courseId }, order: 'position ASC' })
    .then(activities => res.json({ data: activities }));
}

function remove(req, res, next) {
  const id = req.params.activityKey;

  return Activity
    .findById(id)
    .then(activity => activity.deleteTree())
    .then(data => res.json({ data }));
}

function reorder(req, res, next) {
  const id = req.params.activityId;
  const position = req.body.position;

  return Activity
    .findById(id)
    .then(activity => activity.reorder(position))
    .then(data => res.json({ data }));
}

module.exports = {
  create,
  show,
  list,
  remove,
  reorder
};
