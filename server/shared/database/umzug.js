'use strict';

const Umzug = require('umzug');

module.exports = db => new Umzug({
  storage: 'json',
  storageOptions: {},
  logging: false,
  migrations: {
    params: [db.sequelize.getQueryInterface(), db.sequelize.constructor, db],
    path: './server/shared/database/migrations'
  }
});

module.exports = umzug;
