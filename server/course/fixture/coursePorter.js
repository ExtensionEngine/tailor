'use strict';

const CourseModel = require('../course.model').Model;
const courses = require('./courseData').data;

function insertFixtures(db) {
  const model = new CourseModel(db);
  const promises = courses.map(course => model.create(course));
  return Promise.all(promises);
}

module.exports = {
  insertFixtures
};
