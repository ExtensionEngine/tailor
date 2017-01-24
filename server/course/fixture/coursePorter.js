'use strict';

const CourseModel = require('../course.model').Model;
const courses = require('./courseData').data;

function insertFixtures(db, users = null) {
  const data = processUsers(courses, users);
  const model = new CourseModel(db);
  return Promise.all(data.map(course => model.create(course)));
}

function processUsers(courses, users) {
  if (!users) return courses;
  return courses.map(c => {
    let result = {};
    c.users.forEach(it => (result[users[it.index]._key] = it.role));
    c.users = result;
    return c;
  });
}

module.exports = {
  insertFixtures
};
