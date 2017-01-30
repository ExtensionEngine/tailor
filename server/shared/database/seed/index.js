const Promise = require('bluebird');
const range = require('lodash/range');

const courseData = require('./courses.json').data;
const userData = require('./users.json').data;
const { maxPos, maxLevel } = require('./activity.json').data;

function initializeModel(Model, records) {
  const result = [];
  records.forEach(it => result.push(Model.create(it)));
  return Promise.all(result);
}
function insertActivities(Activity, course, result, level, parent) {
  range(maxPos).forEach(pos => {
    let name = level ? 'Sub' : 'Main';
    let activity;

    let promise = Activity.create({
      name: `${name} activity ${pos}`,
      type: 'basic',
      position: pos
    }).then(data => {
      let promises = [];
      activity = data;

      promises.push(course.addActivity(activity));
      if (parent) promises.push(parent.addChild(activity));

      return promises;
    }).then(promises => {
      if (level < maxLevel) insertActivities(Activity, course, result, ++level, activity);
    });

    result.push(promise);
  });
}


function insertAll(db) {
  let users = initializeModel(db.User, userData);
  let courses = initializeModel(db.Course, courseData);
  return Promise.join(users, courses).then(() => {
    let result = [];
    users = users.value();
    courses = courses.value();

    courses.forEach(course => {
      insertActivities(db.Activity, course, result, 0, null);
      result.push(course.setUsers(users));
    });
    return Promise.all(result);
  });
};

module.exports = db => {
  return db.User.findOne().then(user => {
    return user ? false : insertAll(db);
  });
};
