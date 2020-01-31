'use strict';

const { Model } = require('sequelize');

class Tag extends Model {
  static fields({ STRING, DATE }) {
    return {
      name: {
        type: STRING,
        allowNull: false
      },
      createdAt: {
        type: DATE,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: DATE,
        allowNull: false,
        field: 'updated_at'
      },
      deletedAt: {
        type: DATE,
        field: 'deleted_at'
      }
    };
  }

  static associate({ Repository, RepositoryTag }) {
    this.belongsToMany(Repository, {
      through: RepositoryTag,
      foreignKey: { name: 'tagId', field: 'tag_id' }
    });
  }

  static options() {
    return {
      modelName: 'tag',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = Tag;
