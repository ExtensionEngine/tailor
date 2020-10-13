'use strict';

require('dotenv').config();
require('../shared/logger').enabled = false;

const { User } = require('../shared/database');

User.findOne({ where: { role: 'INTEGRATION' } })
  .then(user => user.createToken({}))
  .then(token => {
    console.log(`Integration token generated: ${token}`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message || err);
    process.exit(1);
  });
