'use strict';

const TABLE_NAME = 'entity_tag';

exports.up = (queryInterface, Sequelize) => {
  return queryInterface.createTable(TABLE_NAME, {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
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
    },
    type: {
      type: Sequelize.ENUM(['REPOSITORY']),
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
      allowNull: false
    },
    deletedAt: {
      type: Sequelize.DATE,
      field: 'deleted_at'
    }
  });
};

exports.down = queryInterface => queryInterface.dropTable(TABLE_NAME);
