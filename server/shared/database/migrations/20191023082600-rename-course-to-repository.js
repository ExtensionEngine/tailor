'use strict';

const TABLE_NAME = 'course';
const NEW_TABLE_NAME = 'repository';

exports.up = queryInterface => queryInterface.renameTable(TABLE_NAME, NEW_TABLE_NAME);

exports.down = queryInterface => queryInterface.renameTable(NEW_TABLE_NAME, TABLE_NAME);
