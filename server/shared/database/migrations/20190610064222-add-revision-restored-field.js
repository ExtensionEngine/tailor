'use strict';

const { Sequelize } = require('sequelize');

const TABLE_NAME = 'revision';
const COLUMN = 'restored';
const opts = { type: Sequelize.BOOLEAN, defaultValue: false };

module.exports = {
  up: queryInterface => queryInterface.addColumn(TABLE_NAME, COLUMN, opts),
  down: queryInterface => queryInterface.removeColumn(TABLE_NAME, COLUMN)
};
