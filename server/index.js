'use strict';
const arangojs = require('arangojs');
const app = require('./app');
const logger = require('./logger');

const serverPort = process.env.SERVER_PORT;
const dbUri = process.env.ARANGODB_URI;
const dbName = process.env.DB_NAME;

function connectToDb() {
  const db = arangojs(dbUri);
  return db.listUserDatabases()
    .then(names => names.includes(dbName) ? null : db.createDatabase(dbName))
    .then(result => db.useDatabase(dbName));
}

function runApp() {
  return new Promise((resolve, reject) => {
    app.listen(serverPort, err => err ? reject(err) : resolve());
  });
}

connectToDb()
.then(() => logger.info(`Connected to database ${dbName}`))
.then(runApp)
.then(() => logger.info(`Server listening on port ${serverPort}`))
.catch(err => logger.error({ err }));
