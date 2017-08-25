const each = require('lodash/each');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URI);
let db = { Sequelize, sequelize };

const models = {
  Activity: '../../activity/activity.model',
  Course: '../../course/course.model',
  CourseUser: '../../course/courseUser.model',
  Revision: '../../revision/revision.model',
  TeachingElement: '../../teaching-element/te.model',
  User: '../../user/user.model'
};

each(models, (path, name) => {
  db[name] = sequelize.import(path);
});

// Patch Sequelize#method to support getting models by class name.
sequelize.model = function (name) {
  return sequelize.models[name] || db[name];
};

each(db, (v, modelName) => {
  if ('associate' in db[modelName]) db[modelName].associate(db);
});

db['Course'].addHooks(db);
db['Revision'].addHooks(db);

db.initialize = () => sequelize.sync();

module.exports = db;
