const each = require('lodash/each');
const glob = require('glob');
const path = require('path');
const Sequelize = require('sequelize');

const filename = '*.model.js';

const sequelize = new Sequelize(process.env.POSTGRES_URI);
let db = { Sequelize, sequelize };

const pattern = path.join(__dirname, `../../../server/**/${filename}`);
glob.sync(pattern).forEach(path => sequelize.import(path));

const models = sequelize.models;
each(models, model => {
  if (model.associate) model.associate(models);
  if (model.addHooks) model.addHooks(models);
});

module.exports = Object.assign(db, models, {
  initialize() {
    return sequelize.sync();
  }
});
