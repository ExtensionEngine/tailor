'use strict';

const db = require('../shared/database');
const seed = require('../shared/database/seed');

db.sequelize.sync({ force: true })
  .then(() => seed(db))
  .then(() => {
    console.log('DB seeded!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
