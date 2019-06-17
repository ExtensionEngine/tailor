'use strict';

const TABLE_NAME = 'user';
const COLUMN_NAME = 'checked_comments_at';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable(TABLE_NAME);
    if (table.checked_comments_at) return;
    return queryInterface.addColumn(TABLE_NAME, COLUMN_NAME, {
      type: Sequelize.DATE
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME);
  }
};
