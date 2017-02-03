'use strict';

const omit = require('lodash/omit');
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
  const assessment = {
    activityId,
    type: req.body.type,
    data: omit(req.body, ['id', 'type', 'activityId', 'createdAt', 'updatedAt'])
  };
  return req.course.hasActivity(activityId)
    .then(ok => ok
      ? Assessment.create(assessment, { isNewRecord: true, returning: true })
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

module.exports = {
  index,
  create,
  remove
};
