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
      : createError(404, 'Not found'));
}

module.exports = {
  index,
  remove
};
