'use strict';

const app = require('./app');
const bluebird = require('bluebird');
const boxen = require('boxen');
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

const boxenConfig = {
  padding: 4,
  margin: 2,
  borderStyle: 'double',
  borderColor: 'blue',
  align: 'center'
};

database.initialize()
  .then(() => logger.info(`Database initialized`))
  .then(() => require('../config/shared/activities'))
  .then(runApp)
  .then(() => {
    logger.info(`Server listening on port ${config.port}`);
    logger.info(boxen("Tailor 🚀\nIt's aliveeeee", boxenConfig));
  })
  .catch(err => logger.error({ err }));
