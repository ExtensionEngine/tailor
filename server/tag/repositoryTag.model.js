'use strict';

const { Model } = require('sequelize');

class RepositoryTag extends Model {
  static fields({ INTEGER }) {
    return {
      repositoryId: {
        type: INTEGER,
        field: 'repository_id',
        primaryKey: true,
        unique: 'repository_tag_pkey'
      },
      tagId: {
        type: INTEGER,
        field: 'tag_id',
        primaryKey: true,
        unique: 'repository_tag_pkey'
      }
    };
  }

  static associate({ Repository, Tag }) {
    this.belongsTo(Repository, {
      foreignKey: { name: 'repositoryId', field: 'repository_id' }
    });
    this.belongsTo(Tag, {
      foreignKey: { name: 'tagId', field: 'tag_id' }
    });
  }

  static options() {
    return {
      modelName: 'RepositoryTag',
      tableName: 'repository_tag',
      underscored: true,
      timestamps: true
    };
  }
}

module.exports = RepositoryTag;
