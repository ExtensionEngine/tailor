'use strict';

const connector = require('../shared/database').databaseConnector;
const coursePorter = require('../course/fixture/coursePorter');

connector
  .initialize()
  .then(db => coursePorter.insertFixtures(db))
  .then(courses => {
    console.log(JSON.stringify(courses, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message || err);
    process.exit(1);
  });
