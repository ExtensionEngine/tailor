'use strict';

const Promise = require('bluebird');
const { Sequelize } = require('sequelize');

const TABLE_NAME = 'user';

const COLUMNS = {
  first_name: { type: Sequelize.STRING(50) },
  last_name: { type: Sequelize.STRING(50) },
  img_url: { type: Sequelize.TEXT }
};

module.exports = {
  up: queryInterface => Promise.map(Object.entries(COLUMNS), ([name, options]) => {
    return queryInterface.addColumn(TABLE_NAME, name, options);
  }),
  down: queryInterface => Promise.map(Object.entries(COLUMNS), ([name]) => {
    return queryInterface.removeColumn(TABLE_NAME, name);
  })
};
