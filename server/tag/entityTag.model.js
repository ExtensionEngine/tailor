'use strict';

const { Model } = require('sequelize');
const EntityTypes = require('../../config/shared/entityTypes');
const values = require('lodash/values');

class EntityTag extends Model {
  static fields({ INTEGER, ENUM }) {
    return {
      repositoryId: {
        type: INTEGER,
        field: 'repository_id'
      },
      tagId: {
        type: INTEGER,
        field: 'tag_id'
      },
      type: {
        type: ENUM(values(EntityTypes)),
        allowNull: false
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
      modelName: 'EntityTag',
      tableName: 'entity_tag',
      underscored: true,
      timestamps: true
    };
  }
}

module.exports = EntityTag;
