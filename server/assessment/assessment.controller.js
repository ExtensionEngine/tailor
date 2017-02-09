'use strict';

const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const { Assessment } = require('../shared/database/sequelize');
const params = require('../../config/server').queryParams;

function index(req, res) {
  const order = [[
    req.query.sortBy || params.sort.field,
    req.query.sortOrder || params.sort.order.ASC
  ]];
  return req.course.getActivities().then(activities => {
    const activityId = req.query.activityId;
    const where = activityId
      ? { activityId }
      : { activityId: { $in: activities.map(a => a.id) } };
    return Assessment.findAll({ where, order })
      .then(data => res.json({ data }));
  });
}

function create(req, res) {
  const activityId = req.body.activityId;
  return req.course.hasActivity(activityId)
    .then(ok => ok
      ? Assessment.create(req.body, { isNewRecord: true, returning: true })
      : createError(NOT_FOUND, `Activity ${activityId} not found`))
    .then(data => res.json({ data }));
}

function patch({ body, params }, res) {
  const { courseId, assessmentId } = params;
  return Assessment.findOne({ where: { id: assessmentId, courseId } })
    .then(assessment => assessment || createError(NOT_FOUND, 'Not found'))
    .then(assessment => assessment.update({ data: body.data }))
    .then(assessment => res.json({ data: assessment }));
}

function remove({ params }, res) {
  const { courseId, assessmentId } = params;
  return Assessment.destroy({ where: { id: assessmentId, courseId } })
    .then(() => res.end());
}

module.exports = {
  index,
  create,
  patch,
  remove
};
