'use strict';

require('dotenv').config();
require('../shared/logger').enabled = false;

const { User } = require('../shared/database');
const { user: role } = require('../../config/shared').role;

User.findOne({ where: { role: role.INTEGRATION } })
  .then(user => {
    if (!user) return true;
    console.log('Integration already exists');
    process.exit(0);
  })
  .then(() => User.create({ role: role.INTEGRATION }))
  .then(user => {
    console.log(`Integration user created: ${user.id}`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
