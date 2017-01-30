'use strict';

const connector = require('../shared/database').databaseConnector;
const coursePorter = require('../course/fixture/coursePorter');
const activityPorter = require('../activity/fixture/activityPorter');
const userPorter = require('../user/fixture/userPorter');

let db;

connector
  .initialize()
  .then(conn => {
    console.log('Database initialized');
    console.log('Adding users...');
    db = conn;
    return userPorter.insertFixtures(db);
  })
  .then(users => {
    console.log('Adding courses...');
    return coursePorter.insertFixtures(db, users);
  })
  .then(courses => {
    console.log('Adding activities...');
    return activityPorter.insertFixtures(db, courses);
  })
  .then(() => {
    console.log('Seeding complete');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message || err);
    process.exit(1);
  });
