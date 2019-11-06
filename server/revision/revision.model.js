'use strict';

const hooks = require('./hooks');
const { Model } = require('sequelize');

class Revision extends Model {
  static fields(DataTypes) {
    const { DATE, ENUM, JSONB } = DataTypes;
    return {
      entity: {
        type: ENUM,
        values: ['ACTIVITY', 'REPOSITORY', 'TEACHING_ELEMENT'],
        allowNull: false
      },
      operation: {
        type: ENUM,
        values: ['CREATE', 'UPDATE', 'REMOVE'],
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

  static associate({ User, Repository }) {
    this.belongsTo(Repository, {
      foreignKey: { name: 'repositoryId', field: 'repository_id' }
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

  static hooks(Hooks, models) {
    hooks.add(this, Hooks, models);
  }
}

module.exports = Revision;
