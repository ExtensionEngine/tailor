'use strict';

require('dotenv').config();
require('../shared/logger').enabled = false;

const { User } = require('../shared/database');
const { user: role } = require('../../config/shared').role;

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('You must supply two arguments - email and password');
  process.exit(1);
}

const email = args[0];
const password = args[1];

User.create({ email, password, role: role.ADMIN })
  .then(user => {
    console.log(`Administrator created: ${user.email}`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
