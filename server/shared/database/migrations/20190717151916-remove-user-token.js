'use strict';

const { Sequelize } = require('sequelize');

const TABLE = 'user';

module.exports = {
  up: async qi => {
    await qi.removeColumn(TABLE, 'token');
    await qi.changeColumn(TABLE, 'password', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },
  down: async qi => {
    await qi.addColumn(TABLE, 'token', { type: Sequelize.STRING, unique: true });
    await qi.changeColumn(TABLE, 'password', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
