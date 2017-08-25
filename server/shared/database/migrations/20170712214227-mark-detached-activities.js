'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('activity', 'detached', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('activity', 'detached');
  }
};
