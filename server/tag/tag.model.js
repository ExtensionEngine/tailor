'use strict';

const { Model } = require('sequelize');

class Tag extends Model {
  static fields({ STRING }) {
    return {
      name: {
        type: STRING
      }
    };
  }

  static associate({ RepositoryTag }) {
    this.hasMany(RepositoryTag, {
      as: 'repositoryTag',
      foreignKey: { name: 'tagId', field: 'tag_id' }
    });
  }

  static options() {
    return {
      modelName: 'tag',
      timestamps: true,
      paranoid: true
    };
  }
}

module.exports = Tag;
