'use strict';

const db = require('../shared/database');

db.sequelize.sync({ force: true })
  .then(() => {
    console.log('DB has been reset!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
