'use strict';

const TABLE_NAME = 'course_user';
const NEW_TABLE_NAME = 'repository_user';

exports.up = queryInterface => queryInterface.renameTable(TABLE_NAME, NEW_TABLE_NAME);

exports.down = queryInterface => queryInterface.renameTable(NEW_TABLE_NAME, TABLE_NAME);
