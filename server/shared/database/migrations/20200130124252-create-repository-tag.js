'use strict';

const TABLE_NAME = 'repository_tag';

exports.up = (queryInterface, Sequelize) => {
  return queryInterface.createTable(TABLE_NAME, {
    tagId: {
      type: Sequelize.INTEGER,
      field: 'tag_id',
      references: { model: 'tag', key: 'id' },
      onDelete: 'CASCADE'
    },
    repositoryId: {
      type: Sequelize.INTEGER,
      field: 'repository_id',
      references: { model: 'repository', key: 'id' },
      onDelete: 'CASCADE'
    }
  }).then(async () => {
    return queryInterface.addConstraint(TABLE_NAME, {
      name: 'repository_tag_pkey',
      type: 'primary key',
      fields: ['repository_id', 'tag_id']
    });
  });
};

exports.down = queryInterface => queryInterface.dropTable(TABLE_NAME);
