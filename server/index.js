'use strict';

const app = require('./app');
const boxen = require('boxen');
const capitalize = require('to-case').capital;
const contentPluginRegistry = require('./shared/content-plugins');
const pkg = require('../package.json');
const Promise = require('bluebird');
const { promisify } = require('util');

// NOTE: This needs to be done before db models get loaded!
const isProduction = process.env.NODE_ENV === 'production';
Promise.config({ longStackTraces: !isProduction });

/* eslint-disable require-sort/require-sort */
const config = require('../config/server');
const database = require('./shared/database');
const logger = require('./shared/logger')();
/* eslint-enable */

const runApp = promisify(app.listen.bind(app));

database.initialize()
  .then(() => logger.info('Database initialized'))
  .then(() => require('../config/shared/tailor.loader'))
  .then(() => contentPluginRegistry.initialize())
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
