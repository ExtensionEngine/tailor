const Promise = require('bluebird');

const courseData = require('./courses.json').data;
const userData = require('./users.json').data;

function initialize(db) {
  let users = insertMocks(db.User, userData);
  let courses = insertMocks(db.Course, courseData);
  return Promise.join(users, courses).then(() => {
    let result = [];
    users = users.value();
    courses = courses.value();
    courses.forEach(course => result.push(course.setUsers(users)));
    return Promise.all(result);
  });
};

function insertMocks(Model, records) {
  const result = [];
  records.forEach(it => result.push(Model.create(it)));
  return Promise.all(result);
}

module.exports = initialize;
