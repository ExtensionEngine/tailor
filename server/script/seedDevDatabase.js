'use strict';

const connector = require('../shared/database').databaseConnector;
const coursePorter = require('../course/fixture/coursePorter');
const userPorter = require('../user/fixture/userPorter');

let db;

connector
  .initialize()
  .then(conn => {
    console.log('Database initialized');
    console.log('Adding courses...');
    db = conn;
    return coursePorter.insertFixtures(db);
  })
  .then(courses => {
    console.log('Adding users...');
    return userPorter.insertFixtures(db, courses);
  })
  .then(users => {
    console.log('Seeding complete');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message || err);
    process.exit(1);
  });
