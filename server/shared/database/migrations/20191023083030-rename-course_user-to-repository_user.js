'use strict';

const TABLE_NAME = 'course_user';
const NEW_TABLE_NAME = 'repository_user';

module.exports = {
  up: queryInterface => {
    return queryInterface.renameTable(TABLE_NAME, NEW_TABLE_NAME);
  },
  down: queryInterface => {
    return queryInterface.renameTable(NEW_TABLE_NAME, TABLE_NAME);
  }
};
