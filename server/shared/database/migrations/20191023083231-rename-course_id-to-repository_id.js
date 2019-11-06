'use strict';

const Promise = require('bluebird');

const SRC_COL = 'course_id';
const DST_COL = 'repository_id';

const TABLE_NAMES = [
  'activity',
  'comment',
  'revision',
  'repository_user',
  'teaching_element'
];

module.exports = {
  up: queryInterface => {
    return Promise.each(TABLE_NAMES,
      tableName => queryInterface.renameColumn(tableName, SRC_COL, DST_COL)
    );
  },
  down: queryInterface => {
    return Promise.each(TABLE_NAMES,
      tableName => queryInterface.renameColumn(tableName, DST_COL, SRC_COL)
    );
  }
};
