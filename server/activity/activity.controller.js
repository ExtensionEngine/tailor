'use strict';

const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const { Activity } = require('../shared/database/sequelize');

function create(req, res) {
  const activity = {
    name: req.body.name,
    type: req.body.type,
    courseId: req.body.courseId,
    parentId: req.body.parentKey,
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
  const courseId = req.params.courseKey;

  return Activity
    .findAll({ where: { courseId }, order: 'position ASC' })
    .then(activities => res.json({ data: activities }));
}

function remove(req, res, next) {
  const id = req.params.activityKey;

  return Activity
    .findById(id)
    .deleteTree()
    .then(data => res.json({ data }));
}

function reorder(req, res, next) {
  const id = req.params.activityKey;
  const position = req.body.position;

  return Activity
    .findById(id)
    .reorder(position)
    .then(data => res.json({ data }));
}

module.exports = {
  create,
  show,
  list,
  remove,
  reorder
};
