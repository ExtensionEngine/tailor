const assign = require('lodash/assign');
const flattenDeep = require('lodash/flattenDeep');
const Promise = require('bluebird');
const times = require('lodash/times');

const courseData = require('./courses.json').data;
const userData = require('./users.json').data;
const questionData = require('./questions.json').data;

const OUTLINE_LEVELS = ['GOAL', 'OBJECTIVE', 'TOPIC'];
const LEAF = OUTLINE_LEVELS[OUTLINE_LEVELS.length - 1];
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
    const type = OUTLINE_LEVELS[level];
    const name = level ? 'Sub' : 'Main';
    const attrs = { name: `${name} activity ${position}`, type, position };
    activities.push(Model.create(attrs)
      .then(activity => {
        let io = [course.addActivity(activity)];
        if (parent) io.push(parent.addChild(activity));
        return Promise.all(io).then(() => activity);
      })
      .then(item => {
        const nextLevel = level + 1;
        const isLeaf = nextLevel === OUTLINE_LEVELS.length;
        return isLeaf ? item : insertActivities(Model, course, nextLevel, item);
      }));
  });
  return Promise.all(flattenDeep(activities));
}

function insertQuestions(activity) {
  questionData.forEach(assessment => {
    assign(assessment, { courseId: activity.courseId });
    activity.createTel(assessment);
  });
}

function insertAll(db) {
  const { User, Course, Activity } = db;
  const users = initializeModel(User, userData);
  const courses = initializeModel(Course, courseData);

  return Promise.join(users, courses).spread((users, courses) => {
    return Promise.each(courses, course => {
      return insertActivities(Activity, course, 0, null)
        .then(() => Activity.findAll({ where: { courseId: course.id, type: LEAF } }))
        .then(leafs => Promise.each(leafs, it => insertQuestions(it)))
        .then(() => course.setUsers(users));
    });
  });
};

module.exports = db => {
  return db.User.findOne().then(user => {
    return user ? false : insertAll(db);
  });
};
