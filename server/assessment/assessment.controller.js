'use strict';

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

module.exports = {
  index
};
