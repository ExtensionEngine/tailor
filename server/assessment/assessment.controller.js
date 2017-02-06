'use strict';

const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const { Assessment, sequelize } = require('../shared/database/sequelize');
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

function remove(req, res) {
  const q = 'DELETE FROM assessment USING activity ' +
            'WHERE activity."courseId" = ? ' +
            'AND assessment.id = ? ' +
            'RETURNING *';
  return sequelize.query(q, {
    replacements: [req.params.courseId, req.params.assessmentId],
    model: Assessment
  }).then(assessments => assessments.length
    ? res.send({ data: assessments[0] })
    : createError(NOT_FOUND, 'Not found'));
}

function patch(req, res) {
  const data = JSON.stringify(req.body.data);
  const q = 'UPDATE assessment SET data = ? FROM activity ' +
            'WHERE assessment."activityId" = activity.id ' +
            'AND activity."courseId" = ? ' +
            'AND assessment.id = ? ' +
            'RETURNING assessment.id, assessment.type, assessment.data, ' +
            'assessment."createdAt", assessment."updatedAt"';
  return sequelize.query(q, {
    replacements: [data, req.params.courseId, req.params.assessmentId],
    model: Assessment
  }).then(assessments => assessments.length
    ? res.send({ data: assessments[0] })
    : createError(NOT_FOUND, 'Not found'));
}

module.exports = {
  index,
  create,
  patch,
  remove
};
