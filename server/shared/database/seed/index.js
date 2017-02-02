const Promise = require('bluebird');
const times = require('lodash/times');

const assetData = require('./assets.json').data;
const courseData = require('./courses.json').data;
const userData = require('./users.json').data;
const ACTIVITY_LEVELS = 3;
const ACTIVITIES_PER_LEVEL = 4;

function initializeModel(Model, records) {
  const result = [];
  records.forEach(it => result.push(Model.create(it)));
  return Promise.all(result);
}

function insertActivities(Model, course, level, parent) {
  let activities = [];
  times(ACTIVITIES_PER_LEVEL, position => {
    position += 1;
    const name = level ? 'Sub' : 'Main';
    const attrs = { name: `${name} activity ${position}`, position };
    activities.push(Model.create(attrs)
      .then(activity => {
        let io = [course.addActivity(activity)];
        if (parent) io.push(parent.addChild(activity));
        return Promise.all(io).then(() => activity);
      })
      .then(item => {
        const nextLevel = level + 1;
        const isLeaf = nextLevel === ACTIVITY_LEVELS;
        return isLeaf ? item : insertActivities(Model, course, nextLevel, item);
      }));
  });
  return Promise.all(activities);
}

function insertAll(db) {
  let assets = initializeModel(db.Asset, assetData);
  let users = initializeModel(db.User, userData);
  let courses = initializeModel(db.Course, courseData);

  return Promise.join(users, courses).then(() => {
    let result = [];
    users = users.value();
    courses = courses.value();

    courses.forEach(course => {
      result.push(insertActivities(db.Activity, course, 0, null));
      result.push(course.setUsers(users));
    });

    return Promise.all(result, assets);
  });
};

module.exports = db => {
  return db.User.findOne().then(user => {
    return user ? false : insertAll(db);
  });
};
