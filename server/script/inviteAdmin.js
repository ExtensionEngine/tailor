'use strict';

const { User } = require('../shared/database');
const { user: role } = require('../../config/shared').role;

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('You must supply email');
  process.exit(1);
}

const email = args[0];

User.invite({ email, role: role.ADMIN }, { awaitEmail: true })
  .then(user => {
    console.log(`Invitation sent to ${user.email} for Admin role.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
