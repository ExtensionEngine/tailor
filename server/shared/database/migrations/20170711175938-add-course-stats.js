'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('course', 'stats', Sequelize.JSON);
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('course', 'stats');
  }
};
