'use strict';

const app = require('./app');
const bluebird = require('bluebird');
const boxen = require('boxen');
const capitalize = require('to-case').capital;
const pkg = require('../package.json');
const { promisify } = require('util');
const sequelize = require('sequelize');

// NOTE: This needs to be done before db models get loaded!
if (process.env.NODE_ENV !== 'production') {
  sequelize.Promise.config({ longStackTraces: true });
  bluebird.config({ longStackTraces: true });
}

const config = require('../config/server');
const database = require('./shared/database');
const logger = require('./shared/logger');
const runApp = promisify(app.listen.bind(app));
const umzug = require('./shared/database/umzug')(database);

database.initialize()
  .then(() => umzug.pending())
  .then(migrations => {
    if (migrations.length) throw new Error('There are pending migrations.');
  })
  .then(() => logger.info(`Database initialized`))
  .then(() => require('../config/shared/activities'))
  .then(() => runApp(config.port))
  .then(() => {
    logger.info(`Server listening on port ${config.port}`);
    welcome(pkg.name, pkg.version);
  })
  .catch(err => logger.error({ err }));

const message = (name, version) => `
${capitalize(name)} v${version}

It's aliveeeee 🚀

📘  Readme: https://git.io/vxrlj
🐛  Report bugs: https://git.io/vxr8U
`.trim();

function welcome(name, version) {
  const options = {
    padding: 2,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'blue',
    align: 'left'
  };
  console.error(boxen(message(name, version), options));
}
