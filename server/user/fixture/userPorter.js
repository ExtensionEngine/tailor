'use strict';

const UserModel = require('../user.model').Model;
const users = require('./userData').data;

function insertFixtures(db) {
  const model = new UserModel(db);
  return Promise.all(users.map(user => model.create(user)));
}

module.exports = {
  insertFixtures
};
