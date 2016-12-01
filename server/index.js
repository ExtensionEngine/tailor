'use strict';

const app = require('./app');
const database = require('./database');
const logger = require('./logger');

const serverPort = process.env.SERVER_PORT;

function runApp() {
  return new Promise((resolve, reject) => {
    app.listen(serverPort, err => err ? reject(err) : resolve());
  });
}

database.initialize()
  .then(db => logger.info(`Connected to database ${db.name}`))
  .then(runApp)
  .then(() => logger.info(`Server listening on port ${serverPort}`))
  .catch(err => logger.error({ err }));
