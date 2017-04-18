'use strict';

const Promise = require('bluebird');
const { Activity } = require('../shared/database');

Activity.findAll({ order: [['createdAt', 'ASC']] })
  .then(processActivities)
  .then(() => {
    console.log('Activities processed');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });

function processActivities(activities) {
  let goals = {};
  return Promise.each(activities, it => {
    if (it.type) return;
    if (!it.parentId) {
      goals[it.id] = true;
      it.type = 'GOAL';
    } else if (goals[it.parentId]) {
      it.type = 'OBJECTIVE';
    } else {
      it.type = 'TOPIC';
    }

    return it.save();
  });
}
