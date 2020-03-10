'use strict';

const { Model } = require('sequelize');

class Tag extends Model {
  static fields({ STRING }) {
    return {
      name: {
        type: STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true, len: [2, 20] }
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
      freezeTableName: true,
      timestamps: false
    };
  }
}

module.exports = Tag;
