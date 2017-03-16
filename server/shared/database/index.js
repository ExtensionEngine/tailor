const each = require('lodash/each');
const seed = require('./seed');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URI);
let db = { Sequelize, sequelize };

const models = {
  Activity: '../../activity/activity.model',
  Course: '../../course/course.model',
  CourseUser: '../../course/courseUser.model',
  Revision: '../../revision/revision.model',
  Tel: '../../tel/tel.model',
  User: '../../user/user.model'
};

each(models, (path, name) => {
  db[name] = sequelize.import(path);
});

each(db, (v, modelName) => {
  if ('associate' in db[modelName]) db[modelName].associate(db);
});

db['Revision'].addHooks(db);

db.initialize = () => sequelize.sync({ force: false }).then(() => seed(db));

module.exports = db;
