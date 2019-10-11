'use strict';

require('dotenv').config();
const path = require('path');

module.exports = {
  config: path.join(__dirname, './server/shared/database/config.js'),
  seedersPath: path.join(__dirname, './server/shared/database/seeds'),
  migrationsPath: path.join(__dirname, './server/shared/database/migrations')
};
