'use strict';

const connector = require('./connector');
const collection = require('./collection');

module.exports = {
  collection,
  db: connector.db,
  databaseConnector: connector.databaseConnector
};
