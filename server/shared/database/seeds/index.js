'use strict';

const { Activity, Course, User } = require('../index');
const { SCHEMAS } = require('../../../../config/shared/activities');
const find = require('lodash/find');
const get = require('lodash/get');
const map = require('lodash/map');
const Promise = require('bluebird');
const random = require('lodash/random');
const range = require('lodash/range');

const courseData = require('./courses.json').data;
const userData = require('./users.json').data;

async function insertActivities(config, course, level, parent) {
  const { type } = find(config, { level });
  const items = await Promise.map(range(1, random(2, 7)), position => {
    const name = level > 1 ? 'Sub' : 'Main';
    return Activity.create({
      type,
      data: { name: `${name} activity ${position}` },
      position,
      courseId: course.id,
      parentId: get(parent, 'id', null)
    });
  });
  const nextLevel = level + 1;
  const hasChildren = !!find(config, { level: nextLevel });
  return !hasChildren
    ? items
    : Promise.map(items, it => insertActivities(config, course, nextLevel, it));
}

async function insertAll() {
  if (!SCHEMAS.length) throw new Error('Please create repo schema!');
  const schema = find(SCHEMAS, { id: 'DEFAULT_SCHEMA' }) || SCHEMAS[0];
  const courseSeed = map(courseData, it => ({ ...it, schema: schema.id }));
  const initCourses = Promise.map(courseSeed, it => Course.create(it));
  const initUsers = Promise.map(userData, it => User.create(it));
  const [users, courses] = await Promise.all([initUsers, initCourses]);
  await Promise.map(courses, it => insertActivities(schema.structure, it, 1));
  await Promise.map(courses, it => it.setUsers(users));
}

module.exports = () => {
  return insertAll();
};
