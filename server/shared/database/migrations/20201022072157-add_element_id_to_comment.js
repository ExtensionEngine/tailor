'use strict';

const TABLE_NAME = 'comment';

exports.up = async (qi, Sequelize) => {
  await qi.addColumn(TABLE_NAME, 'content_element_id', {
    type: Sequelize.INTEGER,
    references: { model: 'content_element', key: 'id' },
    allowNull: true
  });
};

exports.down = async qi => qi.removeColumn(TABLE_NAME, 'content_element_id');
