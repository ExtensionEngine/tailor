'use strict';

const Sequelize = require('sequelize');
const connector = require('./connector');
const collection = require('./collection');
const logger = require('../logger');

const sequelize = new Sequelize(process.env.POSTGRES_URI);

sequelize
  .authenticate()
  .then(function(yes) {
    logger.info('Connection has been established successfully.');
  })
  .catch(function (err) {
    logger.info('Unable to connect to the database:', err);
  });

module.exports = {
  sequelize,
  collection,
  db: connector.db,
  databaseConnector: connector.databaseConnector
};
