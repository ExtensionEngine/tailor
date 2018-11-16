'use strict';

const TABLE_NAME = 'teaching_element';
const COLUMN_NAME = 'meta';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(TABLE_NAME, COLUMN_NAME, {
      type: Sequelize.JSONB,
      defaultValue: {}
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME);
  }
};
