'use strict';

const Sequelize = require('sequelize');
const connector = require('./connector');
const collection = require('./collection');
const config = require('../../../config/server');

// TODO(marko): Temp solution.
const sequelize = new Sequelize(config.database.postgresUri);

module.exports = {
  sequelize,
  collection,
  db: connector.db,
  databaseConnector: connector.databaseConnector
};
