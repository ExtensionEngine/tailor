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

  get isOrigin() {
    return !this.position && !this.parentId;
  }

  update(values, options) {
    if (!this.isLink || options.revertLink) return super.update(values, options);
    return this.origin.update(values, options)
      .then(origin => origin.getLinks());
  }

  static cloneOrigins(source, courseId, transaction) {
    return Promise.reduce(source, async (acc, activity) => {
      if (!activity.isLink || acc[activity.originId]) return acc;
      const clonedOrigin = await Activity.create({
        courseId,
        parentId: null,
        position: null,
        ...pick(activity.origin, ['type', 'data', 'refs'])
      }, { returning: true, transaction });
      acc[activity.originId] = { id: clonedOrigin.id, links: 0 };
      return acc;
    }, {});
  }

  static async resolveClonedOrigins(clonedActivities, originMappings, transaction) {
    const oneLinkOrigins = Object.values(originMappings).reduce((acc, origin) => {
      if (origin.links === 1) acc.push(origin.id);
      return acc;
    }, []);

    if (!oneLinkOrigins.length) return;
    const links = clonedActivities.filter(activity => oneLinkOrigins.includes(activity.originId));

    return Promise.each(links, async link => {
      const origin = await Activity.findOne({ where: { id: link.originId }, transaction });
      await link.update({ originId: null, data: origin.data }, { transaction, revertLink: true });
      return origin.destroy({ transaction });
    });
  }

  static async cloneActivities(source, courseId, parentId, options) {
    const { idMappings = {}, transaction, cloneOrigins } = options;
    let { originMappings = {} } = options;
    const TeachingElement = this.sequelize.model('TeachingElement');
    if (cloneOrigins) {
      const clonedOrigins = await Activity.cloneOrigins(source, courseId, transaction);
      originMappings = { ...originMappings, ...clonedOrigins };
    }

    const clonedActivitiesMap = source
      .filter(activity => !(activity.isOrigin && idMappings[activity.id]))
      .map(activity => {
        let originId = activity.originId;

        if (originMappings[activity.originId]) {
          originId = originMappings[activity.originId].id;
          originMappings[activity.originId].links = originMappings[activity.originId].links + 1;
        }

        return {
          courseId,
          parentId,
          originId,
          data: activity.isLink ? null : activity.data,
          ...pick(activity, ['type', 'position', 'refs'])
        };
      });

    const clonedActivities = await Activity.bulkCreate(
      clonedActivitiesMap,
      { returning: true, transaction }
    );

    if (cloneOrigins) {
      await Activity.resolveClonedOrigins(clonedActivities, originMappings, transaction);
    }

    return Promise.reduce(source, async (acc, activity, index) => {
      const parent = clonedActivities[index];
      const children = await activity.getChildren({ where: { detached: false } });
      const tes = await TeachingElement.findAll({
        where: { activityId: activity.id, detached: false },
        transaction
      });
      await TeachingElement.cloneElements(tes, parent, transaction);
      acc[activity.id] = parent.id;
      if (!children.length) return acc;
      return Activity.cloneActivities(
        children,
        courseId,
        parent.id,
        { ...options, idMappings, originMappings }
      );
    }, idMappings);
  }

  clone(courseId, parentId, position) {
    return this.sequelize.transaction(transaction => {
      const options = {
        cloneOrigins: courseId !== this.courseId,
        transaction
      };
      if (position) this.position = position;
      return Activity.cloneActivities([this], courseId, parentId, options);
    });
  }

  static async linkActivities(source, parentId = null, position = null, activities = [], transaction) {
    let link;
    const TeachingElement = this.sequelize.model('TeachingElement');
    const tesOptions = { where: { activityId: source.id, detached: false }, transaction };
    const tes = await TeachingElement.findAll(tesOptions);
    const children = await source.getChildren({ where: { detached: false }, transaction });
    const { type, courseId, originId, data } = source;
    if (source.isLink) {
      link = await Activity.create({ type, courseId, originId, position, parentId }, { transaction });
      link.data = source.origin.data;
      activities = [ ...activities, link ];
      if (tes.length) await TeachingElement.linkElements(tes, link, transaction);
      return Promise.reduce(children, (acc, child) => {
        acc.push(child);
        return Activity.linkActivities(child, link.id, child.position, activities, transaction);
      }, activities);
    }

    const origin = await Activity.create({ type, courseId, data, position: null }, { transaction });
    await source.update({ originId: origin.id, data: null }, { transaction });
    source.data = origin.data;
    link = await Activity.create({
      type,
      courseId,
      position,
      parentId,
      originId: origin.id
    }, { transaction });
    link.data = origin.data;
    activities = [ ...activities, source, link ];
    if (tes.length) await TeachingElement.linkElements(tes, link, transaction);
    return Promise.reduce(children, (acc, child) => {
      acc.push(child);
      return Activity.linkActivities(child, link.id, child.position, activities, transaction);
    }, activities);
  }

  link({ parentId, position }) {
    return this.sequelize.transaction(transaction => {
      return Activity.linkActivities(this, parentId, position, [], transaction)
        .then(activities => activities);
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
    return this.sequelize.transaction(async transaction => {
      options = { ...options, transaction };
      if (this.isLink) return this.removeLink(options);
      const TeachingElement = this.sequelize.model('TeachingElement');
      const descendants = await this.descendants({ attributes: ['id'] });
      descendants.all = [...descendants.nodes, ...descendants.leaves];
      let where = { activityId: [...map(descendants.all, 'id'), this.id] };
      await removeAll(TeachingElement, where, options);
      where = { parentId: [...map(descendants.nodes, 'id'), this.id] };
      await removeAll(Activity, where, options);
      return this.destroy(options);
    });
  }

  async removeLink(options = {}) {
    const TeachingElement = this.sequelize.model('TeachingElement');
    let descendants = await this.descendants();
    descendants = [...descendants.nodes].filter(d => d.id !== this.id);
    await removeAll(TeachingElement, { activityId: [ ...map(descendants, 'id') ] }, false);
    await Promise.each(descendants, d => d.destroy(options));
    return this.destroy(options);
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

function removeAll(Model, where = {}, { soft = false, transaction }) {
  if (!soft) return Model.destroy({ where, transaction });
  return Model.update({ detached: true }, { where, transaction });
}

module.exports = Activity;
