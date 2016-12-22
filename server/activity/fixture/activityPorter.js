'use strict';

const ActivityModel = require('../activity.model').Model;
const activities = require('./activityData').data;

function insertActivitiesForCourse(db, course) {
  const numChars = Math.min(course.name.length, 20);
  const courseTitle = course.name.slice(0, numChars);
  const data = activities.map(a => ({
    name: `${courseTitle}... ${a.name}`,
    parentKey: a.parentKey,
    courseKey: course._key
  }));

  const topActivities = data.filter(a => a.parentKey === null);
  const subActivities = data.filter(a => a.parentKey !== null);

  const model = new ActivityModel(db);
  const createTops = topActivities.map(a => model.create(a));
  return Promise.all(createTops)
    .then(createdActivities => {
      // Convert parent indexes into actual parent activity keys.
      for (let i = 0; i < createdActivities.length; i++) {
        for (let j = 0; j < subActivities.length; j++) {
          if (subActivities[j].parentKey === i) {
            subActivities[j].parentKey = createdActivities[i]._key;
          }
        }
      }

      const createSubs = subActivities.map(a => model.create(a));
      return Promise.all(createSubs);
    });
}

function insertFixtures(db, courses) {
  const promises = courses.map(course => insertActivitiesForCourse(db, course));
  return Promise.all(promises);
}

module.exports = {
  insertFixtures
};
