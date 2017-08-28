'use strict';

const Promise = require('bluebird');
const groupBy = require('lodash/groupBy');
const map = require('lodash/map');
const { TeachingElement } = require('../shared/database');

TeachingElement.findAll({
  where: { type: 'ASSESSMENT', position: { $eq: null } },
  order: [['createdAt', 'ASC']]
})
.then(asssessments => groupBy(asssessments, 'activityId'))
.then(processActivities)
.then(() => {
  console.log('Teaching elements processed');
  process.exit(0);
})
.catch(err => {
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
});

function processActivities(activities) {
  return Promise.all(map(activities, processAssessments));
}

function processAssessments(asssessments) {
  return Promise.each(asssessments, (it, i) => {
    it.position = i + 1;
    return it.save();
  });
}
