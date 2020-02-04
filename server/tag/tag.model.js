'use strict';

const { Model } = require('sequelize');

class Tag extends Model {
  static fields({ STRING, DATE }) {
    return {
      name: {
        type: STRING,
        allowNull: false,
        validate: { len: [2, 20] }
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

  static associate({ Repository, EntityTag }) {
    this.belongsToMany(Repository, {
      through: EntityTag,
      foreignKey: { name: 'tagId', field: 'tag_id' }
    });
  }

  static options() {
    return {
      modelName: 'tag',
      underscored: true,
      timestamps: true,
      freezeTableName: true
    };
  }
}

module.exports = Tag;
