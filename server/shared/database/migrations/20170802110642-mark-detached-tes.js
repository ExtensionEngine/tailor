'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('teaching_element', 'detached', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('teaching_element', 'detached');
  }
};
