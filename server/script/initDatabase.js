'use strict';

const connector = require('../shared/database').databaseConnector;
const userModel = require('../user').model;
const { user: role } = require('../../config/shared').role;

// Last two arguments should be admin email and password - strip them out and
// create the admin with those credentials.
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('You must supply exactly two arguments - admin email and password');
  process.exit(1);
}

const email = args[0];
const password = args[1];

connector
  .initialize()
  .then(() => console.log('Database initialized'))
  .then(() => userModel.create({
    email,
    password,
    role: role.ADMIN
  }))
  .then(user => {
    console.log(`Administrator created (user key: ${user._key})`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message || err);
    process.exit(1);
  });
