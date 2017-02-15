'use strict';

const { Assessment } = require('../shared/database/sequelize');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const { sort } = require('../../config/server').queryParams;

function index({ query, course }, res) {
  const { activityId } = query;
  let opts = {
    where: activityId ? { activityId } : {},
    order: [[
      query.sortBy || sort.field,
      query.sortOrder || sort.order.ASC
    ]]
  };

  return course.getAssessments(opts).then(data => res.json({ data }));
}

function create({ params, body, course }, res) {
  const { courseId } = params;
  const { activityId } = body;

  Object.assign(body, { courseId });
  return course.getActivities({ where: { id: activityId } })
    .then(activities => activities.length
      ? Assessment.create(body, { isNewRecord: true, returning: true })
      : createError(NOT_FOUND, `Activity ${activityId} not found`))
    .then(data => res.json({ data }));
}

function patch({ params, body }, res) {
  const { courseId, assessmentId } = params;
  return Assessment.findOne({ where: { id: assessmentId, courseId } })
    .then(assessment => assessment || createError(NOT_FOUND, 'Not found'))
    .then(assessment => assessment.update({ data: body.data }))
    .then(data => res.json({ data }));
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
