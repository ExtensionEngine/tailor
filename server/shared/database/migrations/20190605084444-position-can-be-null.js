'use strict';

const TABLE_NAME = 'activity';
const COLUMN_NAME = 'position';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(TABLE_NAME, COLUMN_NAME, {
      type: Sequelize.DOUBLE,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(TABLE_NAME, COLUMN_NAME, {
      type: Sequelize.DOUBLE,
      allowNull: false
    });
  }
};
