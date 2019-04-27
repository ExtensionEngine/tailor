'use strict';

const { getSiblingLevels } = require('../../config/shared/activities');
const { Model, Op } = require('sequelize');
const calculatePosition = require('../shared/util/calculatePosition');
const isEmpty = require('lodash/isEmpty');
const map = require('lodash/map');
const mapValues = require('lodash/mapValues');
const pick = require('lodash/pick');
const pickBy = require('lodash/pickBy');
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
        type: STRING,
        meta: { clone: true }
      },
      position: {
        type: DOUBLE,
        allowNull: false,
        validate: { min: 0 },
        meta: { clone: true }
      },
      data: {
        type: JSONB,
        meta: { clone: true }
      },
      refs: {
        type: JSONB,
        defaultValue: {},
        meta: { clone: true }
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

  static associate({ Comment, Course, TeachingElement }) {
    this.hasMany(TeachingElement, {
      foreignKey: { name: 'activityId', field: 'activity_id' }
    });
    this.hasMany(Comment, {
      foreignKey: { name: 'activityId', field: 'activity_id' }
    });
    this.belongsTo(Course, {
      foreignKey: { name: 'courseId', field: 'course_id' }
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

  static scopes() {
    const notNull = { [Op.ne]: null };
    return {
      root() {
        const where = { parentId: null };
        return { where };
      },
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

  static hooks(Hooks) {
    Hooks.register('afterBulkClone');
  }

  static get views() {
    const cloneableFields = pickBy(this.rawAttributes, ({ meta }) => {
      return meta && Boolean(meta.clone);
    });

    return {
      clone(activity) {
        return mapValues(cloneableFields, (_, name) => activity.get(name));
      }
    };
  }

  static async cloneActivities(activities, courseId, parentId, options) {
    const { lookupTable = {}, context, transaction } = options;
    const items = activities.map(it => ({ ...this.views.clone(it), courseId, parentId }));
    const clonedActivities = await this.bulkCreate(items, { ...options, returning: true });
    if (!isEmpty(clonedActivities)) {
      await this.runHooks('afterBulkClone', clonedActivities, options);
    }
    const TeachingElement = this.sequelize.model('TeachingElement');
    return Promise.reduce(activities, async (acc, activity, index) => {
      const parent = clonedActivities[index];
      acc[activity.id] = parent.id;
      const where = { activityId: activity.id, detached: false };
      const tes = await TeachingElement.findAll({ where, transaction });
      await TeachingElement.cloneElements(tes, parent, { context, transaction });
      const children = await activity.getChildren({ where: { detached: false } });
      if (isEmpty(children)) return acc;
      return Activity.cloneActivities(children, courseId, parent.id, options);
    }, lookupTable);
  }

  clone(courseId, parentId, position, context) {
    return this.sequelize.transaction(transaction => {
      const options = { context, transaction };
      if (position) this.position = position;
      return Activity.cloneActivities([this], courseId, parentId, options);
    });
  }

  /**
   * Maps references for cloned activity.
   * @param {Object} mappings Dict where keys represent old and values new ids.
   * @param {Object} options
   * @returns {Promise.<Activity>} Updated instance.
   */
  mapClonedReferences(mappings, relationships, options) {
    const refs = this.refs || {};
    relationships.forEach(type => {
      if (refs[type]) refs[type] = refs[type].map(it => mappings[it]);
    });
    return this.update({ refs }, options);
  }

  siblings({ filter = {}, transaction }) {
    const { parentId, courseId } = this;
    const where = { ...filter, parentId, courseId };
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
    return this.sequelize.transaction(transaction => {
      return this.descendants({ attributes: ['id'] })
        .then(descendants => {
          descendants.all = [...descendants.nodes, ...descendants.leaves];
          return descendants;
        })
        .then(descendants => {
          const TeachingElement = this.sequelize.model('TeachingElement');
          const activities = map(descendants.all, 'id');
          const where = { activityId: [...activities, this.id] };
          return removeAll(TeachingElement, { ...options, transaction, where })
            .then(() => descendants);
        })
        .then(descendants => {
          const activities = map(descendants.nodes, 'id');
          const where = { parentId: [...activities, this.id] };
          return removeAll(Activity, { ...options, transaction, where });
        })
        .then(() => this.destroy(options))
        .then(() => this);
    });
  }

  reorder(index) {
    return this.sequelize.transaction(transaction => {
      const types = getSiblingLevels(this.type).map(it => it.type);
      const filter = { type: types };
      return this.siblings({ filter, transaction }).then(siblings => {
        this.position = calculatePosition(this.id, index, siblings);
        return this.save({ transaction });
      });
    });
  }
}

function removeAll(Model, { soft = false, ...options }) {
  if (!soft) return Model.destroy(options);
  return Model.update({ detached: true }, options);
}

module.exports = Activity;
