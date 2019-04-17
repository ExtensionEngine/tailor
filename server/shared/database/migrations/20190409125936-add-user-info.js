'use strict';

const Promise = require('bluebird');
const { Sequelize } = require('sequelize');

const TABLE_NAME = 'user';
const options = { type: Sequelize.STRING, defaultValue: '' };
const COLLUMNS = [
  { name: 'first_name', options },
  { name: 'last_name', options },
  { name: 'img_url', options }
];

module.exports = {
  up: queryInterface => Promise.map(COLLUMNS, it => {
    return queryInterface.addColumn(TABLE_NAME, it.name, it.options);
  }),
  down: queryInterface => Promise.map(COLLUMNS, it => {
    return queryInterface.removeColumn(TABLE_NAME, it.name);
  })
};
