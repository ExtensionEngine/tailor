'use strict';

const TABLE_NAME = 'comment';
const COLUMN_NAME = 'resolved_at';

exports.up = (qi, { DATE }) => qi.addColumn(TABLE_NAME, COLUMN_NAME, { type: DATE });

exports.down = qi => qi.removeColumn(TABLE_NAME, COLUMN_NAME);
