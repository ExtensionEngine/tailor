'use strict';

const { Comment: Events } = require('../../common/sse');
const hooks = require('./hooks');
const { Model } = require('sequelize');
const sse = require('../shared/sse');

class Comment extends Model {
  static fields(DataTypes) {
    const { DATE, TEXT, UUID, UUIDV4 } = DataTypes;
    return {
      uid: {
        type: UUID,
        unique: true,
        allowNull: false,
        defaultValue: UUIDV4
      },
      content: {
        type: TEXT,
        allowNull: false,
        validate: { len: [1, 2000] },
        get() {
          const deletedAt = this.getDataValue('deletedAt');
          if (deletedAt) return 'This comment has been deleted';
          return this.getDataValue('content');
        }
      },
      resolvedAt: {
        type: DATE,
        field: 'resolved_at'
      },
      editedAt: {
        type: DATE,
        field: 'edited_at'
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

  static hooks(Hooks, models) {
    hooks.add(this, Hooks, models);
  }

  static associate({ Activity, ContentElement, Repository, User }) {
    this.belongsTo(Activity, {
      foreignKey: { name: 'activityId', field: 'activity_id' }
    });
    this.belongsTo(ContentElement, {
      as: 'contentElement',
      foreignKey: { name: 'contentElementId', field: 'content_element_id' }
    });
    this.belongsTo(Repository, {
      foreignKey: { name: 'repositoryId', field: 'repository_id' }
    });
    this.belongsTo(User, {
      as: 'author',
      foreignKey: { name: 'authorId', field: 'author_id' }
    });
  }

  static options() {
    return {
      modelName: 'comment',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  static get Events() {
    return Events;
  }

  static emitResolvement(comments) {
    const { Events } = this;
    comments.forEach(comment => {
      sse.channel(comment.repositoryId).send(Events.Update, comment);
    });
  }
}

module.exports = Comment;
