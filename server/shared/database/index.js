'use strict';

const { migrationsPath } = require('../../../sequelize.config');
const { wrapAsyncMethods } = require('./helpers');
const config = require('./config');
const forEach = require('lodash/forEach');
const Hooks = require('./hooks');
const invoke = require('lodash/invoke');
const logger = require('../logger');
const pick = require('lodash/pick');
const pkg = require('../../../package.json');
const semver = require('semver');
const Sequelize = require('sequelize');
const Umzug = require('umzug');

// Require models.
const User = require('../../user/user.model');
const Course = require('../../course/course.model');
const CourseUser = require('../../course/courseUser.model');
const Activity = require('../../activity/activity.model');
const TeachingElement = require('../../teaching-element/te.model');
const Revision = require('../../revision/revision.model');
const Comment = require('../../comment/comment.model');

const isProduction = process.env.NODE_ENV === 'production';
const sequelize = createConnection(config);

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

const models = {
  User: defineModel(User),
  Course: defineModel(Course),
  CourseUser: defineModel(CourseUser),
  Activity: defineModel(Activity),
  TeachingElement: defineModel(TeachingElement),
  Revision: defineModel(Revision),
  Comment: defineModel(Comment)
};

function defineModel(Model, connection = sequelize) {
  const { DataTypes } = connection.Sequelize;
  applyMixins(Model);
  const fields = invoke(Model, 'fields', DataTypes, connection) || {};
  const options = invoke(Model, 'options') || {};
  Object.assign(options, { sequelize: connection });
  wrapAsyncMethods(Model);
  return Model.init(fields, options);
}

forEach(models, model => {
  invoke(model, 'associate', models);
  addHooks(model, Hooks, models);
  addScopes(model, models);
});

Hooks.setup(Sequelize);

function applyMixins(Model) {
  const mixins = invoke(Model, 'mixins') || [];
  return mixins.reduce((model, mixin) => {
    mixin(model);
    return model;
  }, Model);
}

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

// Patch Sequelize#method to support getting models by class name.
sequelize.model = name => sequelize.models[name] || db[name];

module.exports = db;

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
  const type = sequelize.QueryTypes.VERSION;
  return sequelize.query('SHOW server_version', { type })
    .then(version => {
      logger.info({ version }, 'PostgreSQL version:', version);
      const range = pkg.engines && pkg.engines.postgres;
      if (!range) return;
      if (semver.satisfies(semver.coerce(version), range)) return;
      const err = new Error(`"${pkg.name}" requires PostgreSQL ${range}`);
      logger.error({ version, required: range }, err.message);
      return Promise.reject(err);
    });
}
