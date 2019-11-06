'use strict';

const TABLE_NAME = 'course';
const NEW_TABLE_NAME = 'repository';

module.exports = {
  up: queryInterface => {
    return queryInterface.renameTable(TABLE_NAME, NEW_TABLE_NAME);
  },
  down: queryInterface => {
    return queryInterface.renameTable(NEW_TABLE_NAME, TABLE_NAME);
  }
};
