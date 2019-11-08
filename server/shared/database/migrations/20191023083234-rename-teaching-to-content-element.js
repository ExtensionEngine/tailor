'use strict';

const TABLE_NAME = 'teaching_element';
const NEW_TABLE_NAME = 'content_element';

exports.up = queryInterface => queryInterface.renameTable(TABLE_NAME, NEW_TABLE_NAME);

exports.down = queryInterface => queryInterface.renameTable(NEW_TABLE_NAME, TABLE_NAME);
