'use strict';

const TABLE_NAME = 'course_user';
const COLUMN_NAME = 'pinned';

module.exports = {
  up: (queryInterface, { BOOLEAN }) => {
    return queryInterface.addColumn(TABLE_NAME, COLUMN_NAME, {
      type: BOOLEAN,
      defaultValue: false
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME);
  }
};
