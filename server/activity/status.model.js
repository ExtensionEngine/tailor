'use strict';

const { Activity: Events } = require('../../common/sse');
const hooks = require('./status.hooks');
const { Model } = require('sequelize');
const { workflow } = require('@tailor/config');

const { priorities } = workflow;
const priorityIds = priorities.map(it => it.id);

class ActivityStatus extends Model {
  static fields({ DATE, ENUM, STRING, TEXT, FLOAT, UUID, UUIDV4 }) {
    return {
      status: {
        type: STRING,
        allowNull: false
      },
      priority: {
        type: ENUM(priorityIds),
        allowNull: false
      },
      description: {
        type: TEXT
      },
      dueDate: {
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

  static associate({ Activity, User }) {
    this.belongsTo(Activity);
    this.belongsTo(User, {
      as: 'assignee',
      foreignKey: { name: 'assigneeId', field: 'assignee_id' }
    });
  }

  static scopes({ User }) {
    return {
      defaultScope: {
        include: [{ model: User, as: 'assignee' }],
        order: [['createdAt', 'DESC']],
        limit: 1
      }
    };
  }

  static options() {
    return {
      modelName: 'ActivityStatus',
      tableName: 'activity_status',
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      underscored: true
    };
  }

  static get Events() {
    return Events;
  }

  static hooks(Hooks, models) {
    hooks.add(this, Hooks, models);
  }
}

module.exports = ActivityStatus;
