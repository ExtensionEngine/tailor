'use strict';

const { Sequelize } = require('sequelize');

const TABLE = 'user';

module.exports = {
  up: async qi => {
    return qi.sequelize.transaction(async transaction => {
      await qi.removeColumn(TABLE, 'token', { transaction });
      await qi.changeColumn(TABLE, 'password', {
        type: Sequelize.STRING,
        allowNull: false
      }, { transaction });
    });
  },
  down: async qi => {
    return qi.sequelize.transaction(async transaction => {
      await qi.addColumn(TABLE, 'token', { type: Sequelize.STRING, unique: true }, { transaction });
      await qi.changeColumn(TABLE, 'password', {
        type: Sequelize.STRING,
        allowNull: true
      }, { transaction });
    });
  }
};
