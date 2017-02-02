const Promise = require('bluebird');
const times = require('lodash/times');
const clone = require('lodash/clone');
const flattenDeep = require('lodash/flattenDeep');

const assessmentData = require('./assessments.json').data;
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

    return Promise.all(result).then(stuff => {
      const activities = flattenDeep(stuff.filter((_, i) => i % 2 === 0));
      return Promise.all(activities.map(a => {
        const data = clone(assessmentData);
        data.forEach(d => { d.activityId = a.id; });
        return initializeModel(db.Assessment, data);
      }));
    });
  });
};

module.exports = db => {
  return db.User.findOne().then(user => {
    return user ? false : insertAll(db);
  });
};
