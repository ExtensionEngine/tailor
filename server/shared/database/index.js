const each = require('lodash/each');
const invoke = require('lodash/invoke');
const reduce = require('lodash/reduce');
const Sequelize = require('sequelize');

Sequelize.Promise.config({ longStackTraces: true });

const sequelize = new Sequelize(process.env.POSTGRES_URI);
const { DataTypes } = sequelize.Sequelize;

let models = {
  Activity: '../../activity/activity.model',
  Course: '../../course/course.model',
  CourseUser: '../../course/courseUser.model',
  Revision: '../../revision/revision.model',
  TeachingElement: '../../teaching-element/te.model',
  User: '../../user/user.model'
};

models = reduce(models, (acc, path, name) => {
  acc[name] = defineModel(require(path));
  return acc;
}, {});

each(models, model => {
  invoke(model, 'associate', models);
  invoke(model, 'addHooks', models);
});

const db = Object.assign({
  Sequelize,
  sequelize,
  initialize() { return sequelize.sync(); }
}, models);

// Patch Sequelize#method to support getting models by class name.
sequelize.model = function (name) {
  return sequelize.models[name] || db[name];
};

module.exports = db;

function defineModel(Model) {
  const fields = invoke(Model, 'fields', DataTypes, sequelize) || {};
  const hooks = invoke(Model, 'hooks') || {};
  const options = invoke(Model, 'options') || {};
  const model = Model.init(fields, { sequelize, hooks, ...options });
  return model;
}
