'use strict';

const OLD_TABLE_NAME = 'course';
const NEW_TABLE_NAME = 'repository';

module.exports = {
  up: queryInterface => {
    return queryInterface.renameTable(OLD_TABLE_NAME, NEW_TABLE_NAME);
  },

  down: queryInterface => {
    return queryInterface.renameTable(NEW_TABLE_NAME, OLD_TABLE_NAME);
  }
};
