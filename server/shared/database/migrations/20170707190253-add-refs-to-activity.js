'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('activity', 'refs', Sequelize.JSON);
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('activity', 'refs');
  }
};
