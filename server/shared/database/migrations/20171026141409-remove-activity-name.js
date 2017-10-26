'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.removeColumn('activity', 'name');
  },
  down(queryInterface, Sequelize) {
    return queryInterface.addColumn('activity', 'name', {
      type: Sequelize.STRING
    });
  }
};
