'use strict';

const { Comment } = require('../');

const TABLE_NAME = 'comment';
const COLUMN_NAME = 'edited_at';

exports.up = async (qi, { Op, col, DATE }) => {
  await qi.addColumn(TABLE_NAME, COLUMN_NAME, { type: DATE });
  const attributes = ['id', 'createdAt', 'updatedAt'];
  const where = { createdAt: { [Op.ne]: col('updated_at') } };
  return Comment.findAll({ where, attributes })
    .map(comment => comment.update({ editedAt: comment.updatedAt }));
};

exports.down = qi => qi.removeColumn(TABLE_NAME, COLUMN_NAME);
