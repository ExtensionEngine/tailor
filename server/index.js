'use strict';

const app = require('./app');
const logger = require('./logger');
const config = require('../config/server');
const connector = require('./shared/database').databaseConnector;

function runApp() {
  return new Promise((resolve, reject) => {
    app.listen(config.port, err => err ? reject(err) : resolve());
  });
}

connector.initialize()
  .then(db => logger.info(`Connected to database ${db.name}`))
  .then(runApp)
  .then(() => logger.info(`Server listening on port ${config.port}`))
  .catch(err => logger.error({ err }));
