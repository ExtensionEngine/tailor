'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('teaching_element', 'refs', {
      type: Sequelize.JSON,
      defaultValue: {}
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('teaching_element', 'refs');
  }
};
