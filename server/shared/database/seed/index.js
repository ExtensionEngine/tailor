const Promise = require('bluebird');

const assetData = require('./assets.json').data;
const courseData = require('./courses.json').data;
const userData = require('./users.json').data;

function initializeModel(Model, records) {
  const result = [];
  records.forEach(it => result.push(Model.create(it)));
  return Promise.all(result);
}

function insertAll(db) {
  let assets = initializeModel(db.Asset, assetData);
  let users = initializeModel(db.User, userData);
  let courses = initializeModel(db.Course, courseData);
  return Promise.join(assets, users, courses).then(() => {
    let result = [];
    users = users.value();
    courses = courses.value();
    courses.forEach(course => result.push(course.setUsers(users)));
    return Promise.all(assets, result);
  });
};

module.exports = db => {
  return db.User.findOne().then(user => {
    return user ? false : insertAll(db);
  });
};
