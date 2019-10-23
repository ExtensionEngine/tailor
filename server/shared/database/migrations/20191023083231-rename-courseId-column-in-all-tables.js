'use strict';

const Promise = require('bluebird');

const TABLE_NAMES = [
  'activity',
  'comment',
  'revision',
  'teaching_element'
];

module.exports = {
  up: queryInterface => {
    return Promise.each(TABLE_NAMES,
      tableName => queryInterface.renameColumn(tableName, 'course_id', 'repository_id')
    );
  },

  down: queryInterface => {
    return Promise.each(TABLE_NAMES,
      tableName => queryInterface.renameColumn(tableName, 'repository_id', 'course_id')
    );
  }
};
