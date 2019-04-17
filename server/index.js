'use strict';

const app = require('./app');
const bluebird = require('bluebird');
const boxen = require('boxen');
const pkg = require('../package.json');
const { promisify } = require('util');
const sequelize = require('sequelize');
const { upperCaseFirst } = require('change-case');

// NOTE: This needs to be done before db models get loaded!
if (process.env.NODE_ENV !== 'production') {
  sequelize.Promise.config({ longStackTraces: true });
  bluebird.config({ longStackTraces: true });
}

const config = require('../config/server');
const database = require('./shared/database');
const logger = require('./shared/logger');
const runApp = promisify(app.listen.bind(app));

database.initialize()
  .then(() => logger.info(`Database initialized`))
  .then(() => require('../config/shared/activities'))
  .then(() => runApp(config.port))
  .then(() => {
    logger.info(`Server listening on port ${config.port}`);
    welcome(pkg.name, pkg.version);
  })
  .catch(err => logger.error({ err }));

const message = (name, version) => `
${upperCaseFirst(name)} v${version}

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
