'use strict';

const TABLE_NAME = 'tag';
const COLUMN_NAME = 'is_access_tag';

exports.up = (qi, { BOOLEAN }) =>
  qi.addColumn(TABLE_NAME, COLUMN_NAME, { type: BOOLEAN, defaultValue: false });

exports.down = qi => qi.removeColumn(TABLE_NAME, COLUMN_NAME);
