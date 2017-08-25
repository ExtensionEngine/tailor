'use strict';

const { Activity, Course, TeachingElement } = require('../shared/database');
const Promise = require('bluebird');

Course.findAll()
  .then(processStats)
  .then(() => {
    console.log('Stats processed');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });

function processStats(courses) {
  return Promise.each(courses, it => {
    let activityFilter = { courseId: it.id, type: 'TOPIC' };
    let assessmentFilter = { courseId: it.id, type: 'ASSESSMENT' };
    let objectives = Activity.count({ where: activityFilter });
    let assessments = TeachingElement.count({ where: assessmentFilter });
    return Promise.all([objectives, assessments]).then(([objectiveCount, assessmentCount]) => {
      it.stats = {
        objectives: objectiveCount,
        assessments: assessmentCount
      };
      it.changed('stats', true);
      return it.save();
    });
  });
}
