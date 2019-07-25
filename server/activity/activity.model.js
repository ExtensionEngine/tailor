'use strict';

const { getSiblingLevels } = require('../../config/shared/activities');
const { Model, Op } = require('sequelize');
const calculatePosition = require('../shared/util/calculatePosition');
const isEmpty = require('lodash/isEmpty');
const map = require('lodash/map');
const omitBy = require('lodash/omitBy');
const pick = require('lodash/pick');
const Promise = require('bluebird');

const { ENABLE_ACTIVITY_LINKING } = process.env;

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
      withOrigin: { include: [
        { model: Activity, as: 'origin' },
        { model: Activity, as: 'links' }
      ] }
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
    return this.links && this.links.length > 0;
  }

  static cloneOrigins(source, courseId, idMap, transaction) {
    return Promise.reduce(source, async (acc, { isLink, origin }) => {
      const TeachingElement = this.sequelize.model('TeachingElement');
      if (!isLink || acc[origin.id]) return acc;
      const clonedOrigin = await Activity.create({
        courseId,
        parentId: acc[origin.parentId] ? acc[origin.parentId] : null,
        ...pick(origin, ['type', 'data', 'refs', 'position'])
      }, { returning: true, transaction });
      acc[origin.id] = clonedOrigin.id;
      const tes = await TeachingElement.findAll({
        where: { activityId: origin.id, detached: false },
        transaction
      });
      if (tes.length) await TeachingElement.cloneElements(tes, clonedOrigin, transaction);
      return acc;
    }, idMap);
  }

  static async cloneActivities(source, courseId, parentId, options) {
    const { transaction, cloneOrigins } = options;
    let { idMap = {} } = options;
    const TeachingElement = this.sequelize.model('TeachingElement');
    if (cloneOrigins) {
      idMap = await Activity.cloneOrigins(
        source,
        courseId,
        idMap,
        transaction
      );
    }

    const filteredSource = source
    .filter(activity => !(activity.isOrigin && idMap[activity.id]));

    const clonedActivitiesMap = filteredSource
      .map(activity => {
        let originId = activity.originId;
        if (cloneOrigins && idMap[activity.originId]) {
          originId = idMap[activity.originId];
        }
        return {
          courseId,
          parentId,
          originId,
          data: activity.isLink ? {} : activity.data,
          ...pick(activity, ['type', 'position', 'refs'])
        };
      });

    const clonedActivities = await Activity.bulkCreate(
      clonedActivitiesMap,
      { returning: true, transaction }
    );

    return Promise.reduce(filteredSource,
      async (acc, activity, index) => {
        const parent = clonedActivities[index];
        const children = await activity.getChildren(
          { where: { detached: false } }
        );
        if (!cloneOrigins) {
          const tes = await TeachingElement.findAll({
            where: { activityId: activity.id, detached: false },
            transaction
          });
          if (tes.length) await TeachingElement.cloneElements(tes, parent, transaction);
        }
        acc.idMap[activity.id] = parent.id;
        if (!children.length) return acc;
        return Activity.cloneActivities(
          children,
          courseId,
          parent.id,
          { ...options, idMap }
        );
      }, { idMap });
  }

  clone(courseId, parentId, position) {
    const cloneOrigins = courseId !== this.courseId;
    return this.sequelize.transaction(transaction => {
      if (position) this.position = position;
      const options = { cloneOrigins, transaction };
      return Activity.cloneActivities([this], courseId, parentId, options)
        .then(options => Activity.resolveClonedOrigins(courseId, options));
    });
  }

  static async resolveClonedOrigins(courseId, options) {
    let { idMap } = options;
    if (!ENABLE_ACTIVITY_LINKING) return idMap;
    const { transaction } = options;
    const origins = await Activity.findAll({ where: {
      courseId,
      position: null
    }});

    await Promise.each(origins, async origin => {
      const links = await origin.getLinks({ transaction });
      if (links.length !== 1) return;
      const [ link ] = links;
      const children = await link.getChildren({ transaction });

      if (children.length) {
        await Promise.each(children, async child =>
          child.update({ parentId: this.origin.id }, { transaction })
        );
      }

      await origin.update({ position: link.position, parentId: link.parentId }, { transaction });
      await link.destroy({ transaction });
      idMap = omitBy(idMap, id => id === link.id);
    });

    return idMap;
  }

  static async linkActivities(
    source,
    parentId = null,
    position = null,
    activities = [],
    isChild = false,
    transaction,
    depth = 0
  ) {
    const data = pick(source, [
      'data', 'type', 'courseId', 'parentId', 'position'
    ]);
    const originId = source.isLink ? source.originId : source.id;
    const linksMap = [{ ...data, originId, parentId, position }];
    if (!isChild) linksMap.push({ ...data, originId, position });

    if (parentId && !depth) {
      const parent = await Activity.findOne({ where: { id: parentId }, transaction });
      if (parent && parent.isLink) {
        const parentLinks = await parent.origin.getLinks({ transaction });
        parentLinks.forEach(({ id }) => {
          if (id !== parentId) {
            linksMap.push({ ...data, originId, parentId: id, position });
          }
        });
      }
    }

    const links = await Activity.bulkCreate(
      linksMap,
      { returning: true, transaction }
    );

    activities = [...activities, source.id, ...links.map(link => link.id)];
    const children = await source.getChildren({
      where: { detached: false },
      transaction
    });
    return Promise.reduce(links, async (acc, link) => {
      const result = await Promise.reduce(children, async (acc, child) => {
        const result = await Activity.linkActivities(
          child,
          link.id,
          child.position,
          [],
          true,
          transaction,
          depth + 1
        );
        return [ ...acc, ...result ];
      }, []);
      return [ ...acc, ...result ];
    }, activities);
  }

  link({ parentId, position, child = false }) {
    return this.sequelize.transaction(transaction => {
      return Activity.linkActivities(this, parentId, position, [], child, transaction)
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

  async removeLink(options = {}, depth = 0) {
    return this.sequelize.transaction(async transaction => {
      options = { ...options, transaction };
      let deletedIds = [];
      let descendants = await this.descendants();
      descendants = [...descendants.nodes].filter(d => d.id !== this.id);
      await Promise.each(descendants, d => {
        return d.isLink ? d.removeLink(options, depth + 1) : d.remove(options);
      });
      await this.destroy(options);
      deletedIds.push(this.id);
      if (!this.origin) return deletedIds;
      let links = await this.origin.getLinks(options);
      if (this.parentId && !depth) {
        const parent = await this.getParent(options);
        if (parent && parent.isLink) {
          const parentSiblings = await parent.origin.getLinks(options);
          const parentSiblingsId = parentSiblings.map(it => it.id);
          await Promise.each(links, async link => {
            if (parentSiblingsId.includes(link.parentId)) {
              deletedIds.push(link.id);
              await link.destroy(options);
              omitBy(links, it => it.id === link.id);
            }
          });
        }
      }

      if (links.length > 1) return deletedIds;
      if (!links.length) {
        await this.origin.remove(options);
        return [
          ...deletedIds,
          this.origin.id
        ];
      }

      const [ link ] = links;
      const children = await link.getChildren(options);

      if (children.length) {
        await Promise.each(children, async child =>
          child.update({ parentId: this.origin.id }, options)
        );
      }

      await this.origin.update({ position: link.position, parentId: link.parentId }, options);
      await link.destroy(options);
      return deletedIds;
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

  toJSON() {
    const values = super.toJSON();
    if (!ENABLE_ACTIVITY_LINKING) return values;
    if (!this.isLink) {
      if (!this.isOrigin) {
        return {
          ...values,
          isOrigin: false
        };
      }

      this.links.forEach(link => { link.data = this.data; });

      return {
        ...values,
        links: this.links,
        isOrigin: true
      };
    }
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
