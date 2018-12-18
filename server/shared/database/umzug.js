'use strict';

const Umzug = require('umzug');

const umzug = db => new Umzug({
  storage: 'json',
  storageOptions: {},
  logging: false,
  migrations: {
    params: [db.sequelize.getQueryInterface(), db.sequelize.constructor, db],
    path: './server/shared/database/migrations'
  }
});

module.exports = umzug;
