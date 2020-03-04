'use strict';

const { repository: role } = require('../../config/shared').role;
const { Model } = require('sequelize');

class RepositoryUser extends Model {
  static fields({ BOOLEAN, DATE, ENUM, INTEGER }) {
    return {
      userId: {
        type: INTEGER,
        field: 'user_id',
        primaryKey: true,
        unique: 'repository_user_pkey'
      },
      repositoryId: {
        type: INTEGER,
        field: 'repository_id',
        primaryKey: true,
        unique: 'repository_user_pkey'
      },
      role: {
        type: ENUM(role.ADMIN, role.AUTHOR),
        defaultValue: role.AUTHOR
      },
      pinned: {
        type: BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at'
      },
      deletedAt: {
        type: DATE,
        field: 'deleted_at'
      }
    };
  }

  static associate({ User, Repository }) {
    this.belongsTo(User, {
      foreignKey: { name: 'userId', field: 'user_id' }
    });
    this.belongsTo(Repository, {
      foreignKey: { name: 'repositoryId', field: 'repository_id' }
    });
  }

  static options() {
    return {
      modelName: 'repositoryUser',
      tableName: 'repository_user',
      underscored: true,
      timestamps: true,
      paranoid: true
    };
  }
}

module.exports = RepositoryUser;
