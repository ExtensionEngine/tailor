'use strict';

const TABLE_NAME = 'task';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(TABLE_NAME, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      authorId: {
        type: Sequelize.INTEGER,
        field: 'author_id',
        references: { model: 'user', key: 'id' }
      },
      assigneeId: {
        type: Sequelize.INTEGER,
        field: 'assignee_id',
        references: { model: 'user', key: 'id' }
      },
      repositoryId: {
        type: Sequelize.INTEGER,
        field: 'repository_id',
        references: { model: 'repository', key: 'id' }
      },
      priority: {
        type: Sequelize.ENUM(['TRIVIAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
        allowNull: false
      },
      dueDate: {
        type: Sequelize.DATE,
        field: 'due_date'
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      archivedAt: {
        type: Sequelize.DATE,
        field: 'archived_at'
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
    return queryInterface.addColumn('activity', 'task_id', {
      type: Sequelize.INTEGER,
      references: { model: 'task', key: 'id' }
    });
  },
  down: async queryInterface => {
    await queryInterface.removeColumn('activity', 'task_id');
    return queryInterface.dropTable(TABLE_NAME);
  }
};
