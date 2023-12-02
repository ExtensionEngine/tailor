'use strict';

const TABLE_NAME = 'user_tag';

exports.up = (queryInterface, Sequelize) => {
  return queryInterface.createTable(TABLE_NAME, {
    tagId: {
      type: Sequelize.INTEGER,
      field: 'tag_id',
      references: { model: 'tag', key: 'id' },
      onDelete: 'CASCADE'
    },
    userId: {
      type: Sequelize.INTEGER,
      field: 'user_id',
      references: { model: 'user', key: 'id' },
      onDelete: 'CASCADE'
    }
  }).then(async () => {
    return queryInterface.addConstraint(TABLE_NAME, {
      name: 'user_tag_pkey',
      type: 'primary key',
      fields: ['user_id', 'tag_id']
    });
  });
};

exports.down = queryInterface => queryInterface.dropTable(TABLE_NAME);
