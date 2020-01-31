'use strict';

const TABLE_NAME = 'repository_tag';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(TABLE_NAME, {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tagId: {
      type: Sequelize.INTEGER,
      field: 'tag_id',
      references: { model: 'tag', key: 'id' }
    },
    repositoryId: {
      type: Sequelize.INTEGER,
      field: 'repository_id',
      references: { model: 'repository', key: 'id' }
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
  }),
  down: queryInterface => queryInterface.dropTable(TABLE_NAME)
};
