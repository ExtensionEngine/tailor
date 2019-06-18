'use strict';

const { alterEnum } = require('../helpers');
const { Sequelize } = require('sequelize');

const options = {
  table: 'revision',
  column: 'operation',
  allowNull: false
};

const newOptions = {
  ...options,
  type: Sequelize.ENUM(['CREATE', 'UPDATE', 'REMOVE', 'RESTORE'])
};
const fallbackOptions = {
  ...options,
  type: Sequelize.ENUM(['CREATE', 'UPDATE', 'REMOVE'])
};

module.exports = {
  up: queryInterface => alterEnum(queryInterface, newOptions),
  down: queryInterface => alterEnum(queryInterface, fallbackOptions)
};
