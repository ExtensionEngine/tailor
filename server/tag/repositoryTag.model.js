'use strict';

const { Model } = require('sequelize');

class RepositoryTag extends Model {
  static fields({ INTEGER }) {
    return {
      repositoryId: {
        type: INTEGER,
        field: 'repository_id'
      },
      tagId: {
        type: INTEGER,
        field: 'tag_id'
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
      modelName: 'repository_tag',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = RepositoryTag;
