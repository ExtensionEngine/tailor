const Promise = require('bluebird');

const courseData = require('./courses.json').data;
const userData = require('./users.json').data;

function initializeModel(Model, records) {
  const result = [];
  records.forEach(it => result.push(Model.create(it)));
  return Promise.all(result);
}

function insertAll(db) {
  let users = initializeModel(db.User, userData);
  let courses = initializeModel(db.Course, courseData);
  return Promise.join(users, courses).then(() => {
    let result = [];
    users = users.value();
    courses = courses.value();
    courses.forEach(course => result.push(course.setUsers(users)));
    return Promise.all(result);
  });
};

module.exports = db => {
  return db.User.findOne().then(user => {
    return user ? false : insertAll(db);
  });
};
