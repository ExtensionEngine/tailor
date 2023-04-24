'use strict';

const TABLE_NAME = 'user';
const COLUMN_NAME = 'notifications';

module.exports = {
  up: (queryInterface, { JSONB }) => {
    return queryInterface.addColumn(TABLE_NAME, COLUMN_NAME, {
      type: JSONB,
      defaultValue: { comment: true, assignment: true }
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME);
  }
};
