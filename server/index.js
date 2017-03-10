'use strict';

const app = require('./app');
const config = require('../config/server');
const logger = require('./shared/logger');
const database = require('./shared/database');

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
