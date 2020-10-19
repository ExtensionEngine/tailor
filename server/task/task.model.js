'use strict';

const { Task: Events } = require('../../common/sse');
const hooks = require('./hooks');
const { Model } = require('sequelize');
const { priorities } = require('../../config/shared/workflow');

const priorityIds = priorities.map(it => it.id);

class Task extends Model {
  static fields({ DATE, ENUM, STRING, TEXT, FLOAT, UUID, UUIDV4 }) {
    return {
      uid: {
        type: UUID,
        unique: true,
        allowNull: false,
        defaultValue: UUIDV4
      },
      name: {
        type: STRING,
        allowNull: false
      },
      status: {
        type: STRING,
        allowNull: false
      },
      priority: {
        type: ENUM(priorityIds),
        allowNull: false
      },
      columnPosition: {
        type: FLOAT,
        allowNull: false
      },
      description: {
        type: TEXT
      },
      dueDate: {
        type: DATE
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
      underscored: true,
      indexes: [{ unique: true, fields: ['columnPosition', 'status'] }]
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

  static get Events() {
    return Events;
  }

  static hooks(Hooks, models) {
    hooks.add(this, Hooks, models);
  }
}

module.exports = Task;
