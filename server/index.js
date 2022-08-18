import app from './app.js';
import boxen from 'boxen';
import contentPluginRegistry from './shared/content-plugins/index.js';
import pkg from '../package.json' assert { type: 'json' };
import Promise from 'bluebird';
import { promisify } from 'util';
import toCase from 'to-case';

const capitalize = toCase.capital;

// NOTE: This needs to be done before db models get loaded!
const isProduction = process.env.NODE_ENV === 'production';
Promise.config({ longStackTraces: !isProduction });

/* eslint-disable */
import config from '../config/server/index.js';
import database from './shared/database/index.js';
import getLogger from './shared/logger.js';
const logger = getLogger();
/* eslint-enable */

const runApp = promisify(app.listen.bind(app));

database.initialize()
  .then(() => logger.info('Database initialized'))
  .then(() => import('@tailor-cms/config'))
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
