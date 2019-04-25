'use strict';

const hooks = require('./hooks');
const { Model } = require('sequelize');

const Operation = {
  Create: 'CREATE',
  Update: 'UPDATE',
  Remove: 'REMOVE'
};

class Revision extends Model {
  static fields(DataTypes) {
    const { DATE, ENUM, JSONB } = DataTypes;
    return {
      entity: {
        type: ENUM,
        values: ['ACTIVITY', 'COURSE', 'TEACHING_ELEMENT'],
        allowNull: false
      },
      operation: {
        type: ENUM,
        values: Object.values(Operation),
        allowNull: false
      },
      state: {
        type: JSONB,
        allowNull: true,
        validate: { notEmpty: true }
      },
      createdAt: {
        type: DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at'
      }
    };
  }

  static associate({ Course, User }) {
    this.belongsTo(Course, {
      foreignKey: { name: 'courseId', field: 'course_id' }
    });
    this.belongsTo(User, {
      foreignKey: { name: 'userId', field: 'user_id' }
    });
  }

  static options() {
    return {
      modelName: 'revision',
      freezeTableName: true
    };
  }

  static get Operation() {
    return Operation;
  }

  static hooks(Hooks, models) {
    hooks.add(this, Hooks, models);
  }
}

module.exports = Revision;
