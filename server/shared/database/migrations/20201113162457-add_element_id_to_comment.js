'use strict';

const TABLE_NAME = 'comment';
const COLUMN_NAME = 'content_element_id';

exports.up = (qi, { INTEGER }) => qi.addColumn(TABLE_NAME, COLUMN_NAME, {
  type: INTEGER,
  references: { model: 'content_element', key: 'id' },
  allowNull: true
});

exports.down = qi => qi.removeColumn(TABLE_NAME, 'content_element_id');
