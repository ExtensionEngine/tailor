const each = require('lodash/each');
const reduce = require('lodash/reduce');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URI);

let models = {
  Activity: '../../activity/activity.model',
  Course: '../../course/course.model',
  CourseUser: '../../course/courseUser.model',
  Revision: '../../revision/revision.model',
  TeachingElement: '../../teaching-element/te.model',
  User: '../../user/user.model'
};

models = reduce(models, (dict, path, name) => {
  dict[name] = sequelize.import(path);
  return dict;
}, {});

each(models, model => {
  if (model.associate) model.associate(models);
  if (model.addHooks) model.addHooks(models);
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
