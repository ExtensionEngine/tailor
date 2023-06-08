import config from './config.js';
import createLogger from '../logger.js';
import { createRequire } from 'node:module';
import forEach from 'lodash/forEach.js';
import Hooks from './hooks.js';
import invoke from 'lodash/invoke.js';
import pick from 'lodash/pick.js';
import Promise from 'bluebird';
import semver from 'semver';
import Sequelize from 'sequelize';
import sequelizeConfig from '../../../sequelize.config.js';
import Umzug from 'umzug';
import { wrapMethods } from './helpers.js';

// Require models.
/* eslint-disable */
import User from '../../user/user.model.js';
import Repository from '../../repository/repository.model.js';
import RepositoryTag from '../../tag/repositoryTag.model.js';
import RepositoryUser from '../../repository/repositoryUser.model.js';
import ActivityStatus from '../../activity/status.model.js';
import Activity from '../../activity/activity.model.js';
import ContentElement from '../../content-element/content-element.model.js';
import Revision from '../../revision/revision.model.js';
import Comment from '../../comment/comment.model.js';
import Tag from '../../tag/tag.model.js';
/* eslint-enable */

const require = createRequire(import.meta.url);
const pkg = require('../../../package.json');

const logger = createLogger('db');
const isProduction = process.env.NODE_ENV === 'production';
const sequelize = createConnection(config);
const { migrationsPath } = sequelizeConfig;

function initialize() {
  const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
      tableName: config.migrationStorageTableName
    },
    migrations: {
      params: [sequelize.getQueryInterface(), sequelize.Sequelize],
      path: migrationsPath
    },
    logging(message) {
      if (message.startsWith('==')) return;
      if (message.startsWith('File:')) {
        const file = message.split(/\s+/g)[1];
        return logger.info({ file }, message);
      }
      return logger.info(message);
    }
  });

  umzug.on('migrating', m => logger.info({ migration: m }, '⬆️  Migrating:', m));
  umzug.on('migrated', m => logger.info({ migration: m }, '⬆️  Migrated:', m));
  umzug.on('reverting', m => logger.info({ migration: m }, '⬇️  Reverting:', m));
  umzug.on('reverted', m => logger.info({ migration: m }, '⬇️  Reverted:', m));

  return sequelize.authenticate()
    .then(() => logger.info(getConfig(sequelize), '🗄️  Connected to database'))
    .then(() => checkPostgreVersion(sequelize))
    .then(() => !isProduction && umzug.up())
    .then(() => umzug.executed())
    .then(migrations => {
      const files = migrations.map(it => it.file);
      if (!files.length) return;
      logger.info({ migrations: files }, '🗄️  Executed migrations:\n', files.join('\n'));
    });
}

/**
 * Revision needs to be before Content Element to ensure its hooks are triggered
 * first. This is a temporary fix until a new system for setting up hooks is in
 * place.
 */
const models = {
  User: defineModel(User),
  Repository: defineModel(Repository),
  RepositoryTag: defineModel(RepositoryTag),
  RepositoryUser: defineModel(RepositoryUser),
  ActivityStatus: defineModel(ActivityStatus),
  Activity: defineModel(Activity),
  Revision: defineModel(Revision),
  ContentElement: defineModel(ContentElement),
  Comment: defineModel(Comment),
  Tag: defineModel(Tag)
};

function defineModel(Model, connection = sequelize) {
  const { DataTypes } = connection.Sequelize;
  const fields = invoke(Model, 'fields', DataTypes, connection) || {};
  const options = invoke(Model, 'options') || {};
  Object.assign(options, { sequelize: connection });
  return Model.init(fields, options);
}

forEach(models, model => {
  invoke(model, 'associate', models);
  addHooks(model, Hooks, models);
  addScopes(model, models);
  wrapMethods(model, Promise);
});

function addHooks(model, Hooks, models) {
  const hooks = invoke(model, 'hooks', Hooks, models);
  forEach(hooks, (it, type) => model.addHook(type, it));
}

function addScopes(model, models) {
  const scopes = invoke(model, 'scopes', models);
  forEach(scopes, (it, name) => model.addScope(name, it, { override: true }));
}

const db = {
  Sequelize,
  sequelize,
  initialize,
  ...models
};

wrapMethods(Sequelize.Model, Promise);
// Patch Sequelize#method to support getting models by class name.
sequelize.model = name => sequelize.models[name] || db[name];

function createConnection(config) {
  if (!config.url) return new Sequelize(config);
  return new Sequelize(config.url, config);
}

function getConfig(sequelize) {
  // NOTE: List public fields: https://git.io/fxVG2
  return pick(sequelize.config, [
    'database', 'username', 'host', 'port', 'protocol',
    'pool',
    'native',
    'ssl',
    'replication',
    'dialectModulePath',
    'keepDefaultTimezone',
    'dialectOptions'
  ]);
}

function checkPostgreVersion(sequelize) {
  return sequelize.getQueryInterface().databaseVersion().then(version => {
    logger.info({ version }, 'PostgreSQL version:', version);
    const range = pkg.engines && pkg.engines.postgres;
    if (!range) return;
    if (semver.satisfies(semver.coerce(version), range)) return;
    const err = new Error(`"${pkg.name}" requires PostgreSQL ${range}`);
    logger.error({ version, required: range }, err.message);
    return Promise.reject(err);
  });
}

export {
  Sequelize,
  sequelize,
  initialize,
  models
};

export default db;
