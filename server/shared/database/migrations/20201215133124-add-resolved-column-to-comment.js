'use strict';

const TABLE_NAME = 'comment';
const COLUMN_NAME = 'resolved';

exports.up = (qi, { BOOLEAN }) => {
  return qi.addColumn(TABLE_NAME, COLUMN_NAME, { type: BOOLEAN });
};

exports.down = qi => qi.removeColumn(TABLE_NAME, COLUMN_NAME);
