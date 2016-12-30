'use strict';

const UserModel = require('../user.model').Model;
const users = require('./userData').data;

function insertFixtures(db, courses = null) {
  let data;
  if (courses) {
    data = users.map(u => {
      u.courses = u.courses.map(i => courses[i]._key);
      return u;
    });
  } else {
    data = users;
  }

  const model = new UserModel(db);
  const promises = data.map(user => model.create(user));
  return Promise.all(promises);
}

module.exports = {
  insertFixtures
};
