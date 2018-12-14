'use strict';

const db = require('./index');
const Umzug = require('umzug');

const umzug = new Umzug({
  // Possible values: 'json', 'sequelize', an argument for `require()`
  storage: 'json',
  storageOptions: {},
  // The logging function.
  // A function that gets executed everytime migrations start and have ended.
  logging: false,
  migrations: {
    params: [db.sequelize.getQueryInterface(), db.sequelize.constructor, db],
    path: './server/shared/database/migrations'
  }
});

module.exports = umzug;
