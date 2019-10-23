'use strict';

const { getRepositoryRelationships, getSchema } = require('../../config/shared/activities');
const { Model } = require('sequelize');
const pick = require('lodash/pick');
const Promise = require('bluebird');

class Repository extends Model {
  static fields(DataTypes) {
    const { DATE, JSONB, STRING, TEXT, UUID, UUIDV4 } = DataTypes;
    return {
      uid: {
        type: UUID,
        unique: true,
        defaultValue: UUIDV4
      },
      schema: {
        type: STRING,
        validate: { notEmpty: true, len: [2, 20] }
      },
      name: {
        type: STRING,
        validate: { notEmpty: true, len: [2, 250] }
      },
      description: {
        type: TEXT,
        validate: { notEmpty: true, len: [2, 2000] }
      },
      data: {
        type: JSONB,
        defaultValue: {}
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

  static associate({ Activity, Comment, RepositoryUser, Revision, TeachingElement, User }) {
    this.hasMany(Activity, {
      foreignKey: { name: 'repositoryId', field: 'repository_id' }
    });
    this.hasMany(Comment, {
      foreignKey: { name: 'repositoryId', field: 'repository_id' }
    });
    this.hasMany(TeachingElement, {
      foreignKey: { name: 'repositoryId', field: 'repository_id' }
    });
    this.hasMany(Revision, {
      foreignKey: { name: 'repositoryId', field: 'repository_id' }
    });
    this.hasMany(RepositoryUser, {
      foreignKey: { name: 'repositoryId', field: 'repository_id' }
    });
    this.belongsToMany(User, {
      through: RepositoryUser,
      foreignKey: { name: 'repositoryId', field: 'repository_id' }
    });
  }

  static options() {
    return {
      modelName: 'repository',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  /**
   * Maps references for cloned activities and teaching elements.
   * @param {Object} mappings Dict where keys represent old and values new ids.
   * @param {SequelizeTransaction} [transaction]
   * @returns {Promise.<Object>} Object with mapped activities and elements.
   */
  async mapClonedReferences(mappings, transaction) {
    const Activity = this.sequelize.model('Activity');
    const TeachingElement = this.sequelize.model('TeachingElement');
    const opts = { where: { repositoryId: this.id }, transaction };
    const relationships = getRepositoryRelationships(this.schema);
    const [activities, elements] = await Promise.all([
      Activity.scope({ method: ['withReferences', relationships] }).findAll(opts),
      TeachingElement.scope('withReferences').findAll(opts)
    ]);
    return Promise.join(
      Promise.map(activities, it => it.mapClonedReferences(mappings, relationships, transaction)),
      Promise.map(elements, it => it.mapClonedReferences(mappings, transaction)),
      (activities, elements) => ({ activities, elements })
    );
  }

  clone(name, description, context) {
    const Repository = this.sequelize.model('Repository');
    const Activity = this.sequelize.model('Activity');
    const srcAttributes = pick(this, ['schema', 'data', 'stats']);
    const dstAttributes = Object.assign(srcAttributes, { name, description });
    return this.sequelize.transaction(async transaction => {
      const dst = await Repository.create(dstAttributes, { context, transaction });
      const src = await Activity.findAll({
        where: { repositoryId: this.id, parentId: null }, transaction
      });
      const idMap = await Activity.cloneActivities(src, dst.id, null, { transaction });
      await dst.mapClonedReferences(idMap, transaction);
      return dst;
    });
  }

  getUser(user) {
    return this.getUsers({ where: { id: user.id } })
      .then(users => users[0]);
  }

  getInventoryItems() {
    const where = { detached: false };
    return Promise.all([
      this.getActivities({ where }),
      this.getTeachingElements({ where, order: [['activityId', 'ASC']] })
    ])
    .then(([activities, tes]) => ({ activities, tes }));
  }

  getSchemaConfig() {
    return getSchema(this.schema);
  }
}

module.exports = Repository;
