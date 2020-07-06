'use strict';

const { Model } = require('sequelize');
const { priorities } = require('../../config/shared/workflow');

const priorityIds = priorities.map(it => it.id);

class Task extends Model {
  static fields({ DATE, ENUM, STRING, TEXT }) {
    return {
      priority: {
        type: ENUM(priorityIds)
      },
      dueDate: {
        type: DATE,
        field: 'due_date'
      },
      status: {
        type: STRING
      },
      name: {
        type: STRING
      },
      description: {
        type: TEXT
      },
      archivedAt: {
        type: DATE,
        field: 'archived_at'
      },
      createdAt: {
        type: DATE,
        field: 'created_at',
        allowNull: false
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at',
        allowNull: false
      },
      deletedAt: {
        type: DATE,
        field: 'deleted_at'
      }
    };
  }

  static associate({ Activity, User, Repository }) {
    this.hasMany(Activity);
    this.belongsTo(Repository);
    this.belongsTo(User, {
      as: 'assignee',
      foreignKey: { name: 'assigneeId', field: 'assignee_id' }
    });
    this.belongsTo(User, {
      as: 'author',
      foreignKey: { name: 'authorId', field: 'author_id' }
    });
  }

  static options() {
    return {
      modelName: 'task',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  static scopes() {
    return {
      defaultScope: {
        where: { archivedAt: null }
      }
    };
  }
}

module.exports = Task;
