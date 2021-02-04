'use strict';

const { Comment } = require('../');

exports.up = (_, { Op, col }) => {
  const attributes = ['createdAt', 'updatedAt'];
  const where = { createdAt: { [Op.ne]: col('updated_at') } };
  return Comment.findAll({ where, attributes })
    .map(comment => comment.update({ editedAt: comment.updatedAt }));
};

exports.down = () => {};
