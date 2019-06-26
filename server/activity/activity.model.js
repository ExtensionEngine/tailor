'use strict';

const { getSiblingLevels } = require('../../config/shared/activities');
const { Model, Op } = require('sequelize');
const calculatePosition = require('../shared/util/calculatePosition');
const hooks = require('./hooks');
const isEmpty = require('lodash/isEmpty');
const map = require('lodash/map');
const pick = require('lodash/pick');
const Promise = require('bluebird');

class Activity extends Model {
  static fields(DataTypes) {
    const { STRING, DOUBLE, JSONB, BOOLEAN, DATE, UUID, UUIDV4, INTEGER } = DataTypes;
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
      originId: {
        type: INTEGER
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

  static hooks(Hooks, models) {
    hooks.add(this, Hooks, models);
    this.addHook(
      Hooks.beforeFind,
      options => this._defaultsOptions(options, this.scopes().withOrigin)
    );
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
    this.belongsTo(this, {
      as: 'origin',
      foreignKey: { name: 'originId', field: 'origin_id' }
    });
    this.hasMany(this, {
      as: 'links',
      foreignKey: { name: 'originId', field: 'origin_id' }
    });
  }

  static scopes() {
    const notNull = { [Op.ne]: null };
    return {
      withReferences(relationships = []) {
        const or = relationships.map(type => ({ [`refs.${type}`]: notNull }));
        return { where: { [Op.or]: or } };
      },
      withOrigin: { include: [{ model: Activity, as: 'origin' }] }
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

  get isLink() {
    return !!(this.originId && this.origin);
  }

  update(values, options) {
    if (!this.isLink || options.revertLink) return super.update(values, options);
    return this.origin.update(values, options)
      .then(origin => origin.getLinks());
  }

  static async cloneActivities(src, dstCourseId, dstParentId, opts) {
    if (!opts.idMappings) opts.idMappings = {};
    const { idMappings, transaction } = opts;
    const dstActivities = await Activity.bulkCreate(map(src, it => ({
      courseId: dstCourseId,
      parentId: dstParentId,
      ...pick(it, ['type', 'position', 'data', 'refs'])
    })), { returning: true, transaction });
    const TeachingElement = this.sequelize.model('TeachingElement');
    return Promise.reduce(src, async (acc, it, index) => {
      const parent = dstActivities[index];
      acc[it.id] = parent.id;
      const where = { activityId: it.id, detached: false };
      const tes = await TeachingElement.findAll({ where, transaction });
      await TeachingElement.cloneElements(tes, parent, transaction);
      const children = await it.getChildren({ where: { detached: false } });
      if (!children.length) return acc;
      return Activity.cloneActivities(children, dstCourseId, parent.id, opts);
    }, idMappings);
  }

  clone(courseId, parentId, position) {
    return this.sequelize.transaction(t => {
      if (position) this.position = position;
      return Activity.cloneActivities([this], courseId, parentId, t);
    });
  }

  static async linkActivities(src, parentId = null, position = null, activities = []) {
    let link;
    const TeachingElement = this.sequelize.model('TeachingElement');
    const tesOptions = { where: { activityId: src.id, detached: false } };
    const tes = await TeachingElement.findAll(tesOptions);
    const children = await src.getChildren({ where: { detached: false } });
    const { type, courseId, originId, data } = src;
    if (src.isLink) {
      link = await Activity.create({ type, courseId, originId, position, parentId });
      link.data = src.origin.data;
      activities = [ ...activities, link ];
      if (tes.length) await TeachingElement.linkElements(tes, link);
      return Promise.reduce(children, (acc, child) => {
        acc.push(child);
        return Activity.linkActivities(child, link.id, child.position, activities);
      }, activities);
    }

    const origin = await Activity.create({ type, courseId, data, position: null });
    await src.update({ originId: origin.id, data: null });
    src.data = origin.data;
    link = await Activity.create({
      type,
      courseId,
      position,
      parentId,
      originId: origin.id
    });
    link.data = origin.data;
    activities = [ ...activities, src, link ];
    if (tes.length) await TeachingElement.linkElements(tes, link);
    return Promise.reduce(children, (acc, child) => {
      acc.push(child);
      return Activity.linkActivities(child, link.id, child.position, activities);
    }, activities);
  }

  link({ parentId, position }) {
    return Activity.linkActivities(this, parentId, position)
      .then(activities => activities);
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
    if (this.isLink) return this.removeLink(options);
    if (!options.recursive) return this.destroy(options);
    return this.sequelize.transaction(t => {
      return this.descendants({ attributes: ['id'] })
        .then(descendants => {
          descendants.all = [...descendants.nodes, ...descendants.leaves];
          return descendants;
        })
        .then(descendants => {
          const TeachingElement = this.sequelize.model('TeachingElement');
          const activities = map(descendants.all, 'id');
          const where = { activityId: [...activities, this.id] };
          return removeAll(TeachingElement, where, options.soft)
            .then(() => descendants);
        })
        .then(descendants => {
          const activities = map(descendants.nodes, 'id');
          const where = { parentId: [...activities, this.id] };
          return removeAll(Activity, where, options.soft);
        })
        .then(() => this.destroy(options))
        .then(() => this);
    });
  }

  async removeLink(options = {}) {
    if (!options.recursive) return this.destroy(options);
    try {
      const TeachingElement = this.sequelize.model('TeachingElement');
      const descendants = await this.descendants()
        .then(descendants => {
          return [...descendants.nodes].filter(d => d.id !== this.id);
        });
      await removeAll(TeachingElement, { activityId: [ ...map(descendants, 'id') ] }, false);
      await Promise.each(descendants, d => d.destroy(options));
      await this.destroy(options);
      return this;
    } catch (e) {
      console.log(e);
    }
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

  toJSON() {
    const values = super.toJSON();
    if (!this.isLink) return values;
    return {
      ...values,
      data: this.origin.data,
      refs: this.origin.refs
    };
  }
}

function removeAll(Model, where = {}, soft = false) {
  if (!soft) return Model.destroy({ where, returning: true });
  return Model.update({ detached: true }, { where, returning: true });
}

module.exports = Activity;
