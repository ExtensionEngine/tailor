'use strict';

const db = require('../shared/database');
const seed = require('../shared/database/seeds');

db.sequelize.sync({ force: true })
  .then(() => seed())
  .then(() => {
    console.log('DB seeded!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
