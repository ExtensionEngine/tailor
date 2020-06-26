'use strict';

const TABLE_NAME = 'course';
const COLUMN_NAME = 'stats';

module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME);
  },
  down: (queryInterface, { JSONB }) => {
    return queryInterface.addColumn(TABLE_NAME, COLUMN_NAME, {
      type: JSONB,
      defaultValue: { objectives: 0, assessments: 0 }
    });
  }
};
