'use strict';

const app = require('./app');
const config = require('../config/server');
const logger = require('./shared/logger');
const sequelize = require('./shared/database/sequelize');

function runApp() {
  return new Promise((resolve, reject) => {
    app.listen(config.port, err => err ? reject(err) : resolve());
  });
}

sequelize.initialize()
  .then(() => logger.info(`Database initialized`))
  .then(runApp)
  .then(() => logger.info(`Server listening on port ${config.port}`))
  .catch(err => logger.error({ err }));
