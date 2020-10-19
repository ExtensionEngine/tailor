'use strict';

const TABLE_NAME = 'task';

exports.up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable(TABLE_NAME, {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: Sequelize.UUID,
      unique: true,
      allowNull: false,
      defaultValue: Sequelize.literal('uuid_generate_v4()')
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
    activityId: {
      type: Sequelize.INTEGER,
      field: 'activity_id',
      references: { model: 'activity', key: 'id' }
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    priority: {
      type: Sequelize.ENUM(['TRIVIAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      allowNull: false
    },
    column_position: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    dueDate: {
      type: Sequelize.DATE,
      field: 'due_date'
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
  return queryInterface.addIndex(TABLE_NAME, [
    'column_position',
    'status',
    'repository_id'
  ], {
    unique: true,
    where: { archived_at: null }
  });
};

exports.down = async queryInterface => {
  await queryInterface.dropTable(TABLE_NAME);
  return queryInterface.removeIndex(TABLE_NAME, [
    'column_position',
    'status',
    'repository_id'
  ], {
    unique: true
  });
};
