'use strict';

const Promise = require('bluebird');
const TABLE_NAME = 'user';
const COLLUMNS = ['first_name', 'last_name', 'img_url'];

module.exports = {
  up: (queryInterface, Sequelize) => Promise.each(COLLUMNS, it => {
    const options = { type: Sequelize.STRING, defaultValue: '' };
    return queryInterface.addColumn(TABLE_NAME, it, options);
  }),
  down: queryInterface => Promise.each(COLLUMNS, it => {
    return queryInterface.removeColumn(TABLE_NAME, it);
  })
};
