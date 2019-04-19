'use strict';

const { wrapAsyncMethods } = require('./helpers');
const config = require('./config');
const forEach = require('lodash/forEach');
const Hooks = require('./hooks');
const invoke = require('lodash/invoke');
const logger = require('../logger');
const path = require('path');
const pick = require('lodash/pick');
const pkg = require('../../../package.json');
const semver = require('semver');
const Sequelize = require('sequelize');

// Require models.
const User = require('../../user/user.model');
const Course = require('../../course/course.model');
const CourseUser = require('../../course/courseUser.model');
const Activity = require('../../activity/activity.model');
const TeachingElement = require('../../teaching-element/te.model');
const Revision = require('../../revision/revision.model');
const Comment = require('../../comment/comment.model');

const sequelize = createConnection(config);
const migrations = require('./migrations')(sequelize, {
  path: path.join(__dirname, './migrations/'),
  logger
});

function initialize() {
  return sequelize.authenticate()
    .then(() => logger.info(getConfig(sequelize), '🗄️  Connected to database'))
    .then(() => checkPostgreVersion(sequelize))
    .then(() => migrations.run());
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
  const fields = invoke(Model, 'fields', DataTypes, connection) || {};
  const options = invoke(Model, 'options') || {};
  wrapAsyncMethods(Model);
  return Model.init(fields, { sequelize, ...options });
}

forEach(models, model => {
  invoke(model, 'associate', models);
  addHooks(model, Hooks, models);
  addScopes(model, models);
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
