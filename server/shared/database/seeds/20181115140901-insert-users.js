'use strict';

const bcrypt = require('bcrypt');
const Promise = require('bluebird');

const times = (length, cb) => Array.from({ length }, (_, i) => cb(i));

const now = new Date();
const users = [];

times(5, i => {
  const suffix = i || '';
  users.push({
    email: `admin${suffix}@example.com`,
    password: 'admin123.',
    role: 'ADMIN',
    created_at: now,
    updated_at: now
  });
});

module.exports = {
  up(queryInterface) {
    return import('../../../../config/server/index.js')
      .then(({ auth: config }) => (
        Promise.map(users, user => encryptPassword(user, config.saltRounds))
      ))
      .then(users => queryInterface.bulkInsert('user', users));
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('user');
  }
};

function encryptPassword(user, saltRounds) {
  return bcrypt.hash(user.password, saltRounds)
    .then(password => (user.password = password))
    .then(() => user);
}
