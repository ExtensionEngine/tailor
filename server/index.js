'use strict';

const app = require('./app');
const bluebird = require('bluebird');
const config = require('../config/server');
const database = require('./shared/database');
const logger = require('./shared/logger');
const sequelize = require('sequelize');

if (process.env.NODE_ENV !== 'production') {
  sequelize.Promise.config({ longStackTraces: true });
  bluebird.config({ longStackTraces: true });
}

function runApp() {
  return new Promise((resolve, reject) => {
    app.listen(config.port, err => err ? reject(err) : resolve());
  });
}

database.initialize()
  .then(() => logger.info(`Database initialized`))
  .then(runApp)
  .then(() => logger.info(`Server listening on port ${config.port}`))
  .catch(err => logger.error({ err }));
