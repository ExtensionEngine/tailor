'use strict';

const TABLE_NAME = 'teaching_element';
const COLUMN_NAME = 'origin_id';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable(TABLE_NAME);
    if (table.origin_id) return;
    return queryInterface.addColumn(TABLE_NAME, COLUMN_NAME, {
      type: Sequelize.INTEGER
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME);
  }
};
