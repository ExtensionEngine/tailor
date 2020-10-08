'use strict';

const {
  getSiblingTypes,
  isOutlineActivity
} = require('../../config/shared/activities');
const { Model, Op } = require('sequelize');
const calculatePosition = require('../shared/util/calculatePosition');
const hooks = require('./hooks');
const isEmpty = require('lodash/isEmpty');
const map = require('lodash/map');
const pick = require('lodash/pick');
const Promise = require('bluebird');

class Activity extends Model {
  static fields(DataTypes) {
    const { STRING, DOUBLE, JSONB, BOOLEAN, DATE, UUID, UUIDV4 } = DataTypes;
    return {
      uid: {
        type: UUID,
        unique: true,
        defaultValue: UUIDV4
      },
      type: {
        type: STRING
      },
      position: {
        type: DOUBLE,
        allowNull: false,
        validate: { min: 0 }
      },
      data: {
        type: JSONB
      },
      refs: {
        type: JSONB,
        defaultValue: {}
      },
      detached: {
        type: BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      publishedAt: {
        type: DATE,
        field: 'published_at'
      },
      modifiedAt: {
        type: DATE,
        field: 'modified_at'
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

  static associate({ ContentElement, Comment, Repository }) {
    this.hasMany(ContentElement, {
      foreignKey: { name: 'activityId', field: 'activity_id' }
    });
    this.hasMany(Comment, {
      foreignKey: { name: 'activityId', field: 'activity_id' }
    });
    this.belongsTo(Repository, {
      foreignKey: { name: 'repositoryId', field: 'repository_id' }
    });
    this.belongsTo(this, {
      as: 'parent',
      foreignKey: { name: 'parentId', field: 'parent_id' }
    });
    this.hasMany(this, {
      as: 'children',
      foreignKey: { name: 'parentId', field: 'parent_id' }
    });
  }

  static hooks(Hooks, models) {
    hooks.add(this, Hooks, models);
  }

  static scopes() {
    const notNull = { [Op.ne]: null };
    return {
      withReferences(relationships = []) {
        const or = relationships.map(type => ({ [`refs.${type}`]: notNull }));
        return { where: { [Op.or]: or } };
      }
    };
  }

  static options() {
    return {
      modelName: 'activity',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  static async cloneActivities(src, dstRepositoryId, dstParentId, opts) {
    if (!opts.idMappings) opts.idMappings = {};
    const { idMappings, context, transaction } = opts;
    const dstActivities = await Activity.bulkCreate(map(src, it => ({
      repositoryId: dstRepositoryId,
      parentId: dstParentId,
      ...pick(it, ['type', 'position', 'data', 'refs', 'modifiedAt'])
    })), { returning: true, context, transaction });
    const ContentElement = this.sequelize.model('ContentElement');
    return Promise.reduce(src, async (acc, it, index) => {
      const parent = dstActivities[index];
      acc[it.id] = parent.id;
      const where = { activityId: it.id, detached: false };
      const elements = await ContentElement.findAll({ where, transaction });
      await ContentElement.cloneElements(elements, parent, { context, transaction });
      const children = await it.getChildren({ where: { detached: false } });
      if (!children.length) return acc;
      return Activity.cloneActivities(children, dstRepositoryId, parent.id, opts);
    }, idMappings);
  }

  clone(repositoryId, parentId, position, context) {
    return this.sequelize.transaction(transaction => {
      if (position) this.position = position;
      return Activity.cloneActivities(
        [this], repositoryId, parentId, { context, transaction }
      );
    });
  }

  /**
   * Maps references for cloned activity.
   * @param {Object} mappings Dict where keys represent old and values new ids.
   * @param {SequelizeTransaction} [transaction]
   * @returns {Promise.<Activity>} Updated instance.
   */
  mapClonedReferences(mappings, relationships, transaction) {
    const refs = this.refs || {};
    relationships.forEach(type => {
      if (refs[type]) refs[type] = refs[type].map(it => mappings[it]);
    });
    return this.update({ refs }, { transaction });
  }

  siblings({ filter = {}, transaction }) {
    const { parentId, repositoryId } = this;
    const where = { ...filter, parentId, repositoryId };
    const options = { where, order: [['position', 'ASC']], transaction };
    return Activity.findAll(options);
  }

  predecessors() {
    if (!this.parentId) return Promise.resolve([]);
    return this.getParent().then(parent => {
      return parent.predecessors().then(acc => acc.concat(parent));
    });
  }

  descendants(options = {}, nodes = [], leaves = []) {
    const { attributes } = options;
    const node = !isEmpty(attributes) ? pick(this, attributes) : this;
    nodes.push(node);
    return Promise.resolve(this.getChildren({ attributes }))
      .map(it => it.descendants(options, nodes, leaves))
      .then(children => {
        if (!isEmpty(children)) return { nodes, leaves };
        const leaf = !isEmpty(attributes) ? pick(this, attributes) : this;
        leaves.push(leaf);
        return { nodes, leaves };
      });
  }

  remove(options = {}) {
    if (!options.recursive) return this.destroy(options);
    const { soft } = options;
    return this.sequelize.transaction(transaction => {
      return this.descendants({ attributes: ['id'] })
        .then(descendants => {
          descendants.all = [...descendants.nodes, ...descendants.leaves];
          return descendants;
        })
        .then(descendants => {
          const ContentElement = this.sequelize.model('ContentElement');
          const activities = map(descendants.all, 'id');
          const where = { activityId: [...activities, this.id] };
          return removeAll(ContentElement, where, { soft, transaction })
            .then(() => descendants);
        })
        .then(descendants => {
          const activities = map(descendants.nodes, 'id');
          const where = { parentId: [...activities, this.id] };
          return removeAll(Activity, where, { soft, transaction });
        })
        .then(() => this.destroy({ ...options, transaction }))
        .then(() => this);
    });
  }

  reorder(index, context) {
    return this.sequelize.transaction(transaction => {
      const filter = { type: getSiblingTypes(this.type) };
      return this.siblings({ filter, transaction }).then(siblings => {
        this.position = calculatePosition(this.id, index, siblings);
        return this.save({ transaction, context });
      });
    });
  }

  getOutlineParent(transaction) {
    return this.getParent({ transaction }).then(parent => {
      if (!parent) return Promise.resolve();
      if (isOutlineActivity(parent.type)) return parent;
      return parent.getOutlineParent(transaction);
    });
  }

  touch(transaction) {
    return this.update({ modifiedAt: new Date() }, { transaction });
  }
}

function removeAll(Model, where = {}, options = {}) {
  const { soft, transaction } = options;
  if (!soft) return Model.destroy({ where });
  return Model.update({ detached: true }, { where, transaction });
}

module.exports = Activity;
