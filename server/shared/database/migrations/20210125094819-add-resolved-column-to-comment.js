'use strict';

const TABLE_NAME = 'comment';
const COLUMN_NAME = 'resolved';

exports.up = (qi, { BOOLEAN }) => qi.addColumn(TABLE_NAME, COLUMN_NAME, {
  type: BOOLEAN,
  defaultValue: false
});

exports.down = qi => qi.removeColumn(TABLE_NAME, COLUMN_NAME);
