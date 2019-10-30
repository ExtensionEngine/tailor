'use strict';

const { Sequelize } = require('sequelize');

const TABLE = 'user';
const COLUMN = 'token';
const options = { type: Sequelize.STRING, unique: true };

module.exports = {
  up: queryInterface => queryInterface.removeColumn(TABLE, COLUMN, options),
  down: queryInterface => queryInterface.addColumn(TABLE, COLUMN, options)
};
