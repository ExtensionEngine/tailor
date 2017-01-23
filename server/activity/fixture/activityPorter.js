'use strict';

const ActivityModel = require('../activity.model').Model;
const activities = require('./activityData').data;

function createActivityTree(model, rootActivity, rootIndex, allActivities) {
  return model.create(rootActivity)
    .then(rootAct => {
      const children = [];
      allActivities.forEach((a, i) => {
        if (a.parentKey === rootIndex) {
          // Convert parent index to parent primary key.
          a.parentKey = rootAct._key;
          children.push([a, i]);
        }
      });

      const promises = children.map(pair => {
        return createActivityTree(model, pair[0], pair[1], allActivities);
      });
      return Promise.all(promises);
    });
}

function createActivitiesForCourse(db, course) {
  const numChars = Math.min(course.name.length, 20);
  const courseTitle = course.name.slice(0, numChars);
  const allActivities = activities.map(a => ({
    name: `${courseTitle}: ${a.name}`,
    parentKey: a.parentKey,
    courseKey: course._key
  }));

  const model = new ActivityModel(db);
  const promises = [];
  allActivities.forEach((a, i) => {
    if (a.parentKey === null) {
      promises.push(createActivityTree(model, a, i, allActivities));
    }
  });

  // Return the flat array of activities as result:
  return Promise.all(promises).then(() => model.getMany(course._key));
}

function insertFixtures(db, courses) {
  const promises = courses.map(course => createActivitiesForCourse(db, course));
  return Promise.all(promises);
}

module.exports = {
  insertFixtures
};
