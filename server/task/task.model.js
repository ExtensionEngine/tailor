'use strict';

const hooks = require('./hooks');
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
        type: DATE
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
        type: DATE
      },
      createdAt: {
        type: DATE,
        allowNull: false
      },
      updatedAt: {
        type: DATE,
        allowNull: false
      },
      deletedAt: {
        type: DATE
      }
    };
  }

  static associate({ Activity, User, Repository }) {
    this.belongsTo(Activity);
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
      freezeTableName: true,
      underscored: true
    };
  }

  static scopes({ Activity }) {
    return {
      defaultScope: {
        include: [{
          model: Activity,
          attributes: [],
          where: { detached: false }
        }],
        where: { archivedAt: null }
      }
    };
  }

  static hooks(Hooks, models) {
    hooks.add(this, Hooks, models);
  }
}

module.exports = Task;
