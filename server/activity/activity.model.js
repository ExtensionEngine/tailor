'use strict';

const { getSiblingLevels } = require('../../config/shared/activities');
const { Model, Op } = require('sequelize');
const calculatePosition = require('../shared/util/calculatePosition');
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

  static async linkActivities(src, parentId = null, position = null, opts) {
    const { transaction } = opts;

    if (src.originId) {
      return Activity.findOne(
        { where: { id: src.originId } },
        { transaction }
      ).then(origin =>
        Activity.create({
          ...pick(origin, ['type', 'courseId']),
          position,
          parentId,
          originId: origin.id
        }, opts)
          .then(linked => [linked.id]));
    }

    const originActivity = await Activity.create({
      ...pick(src, ['type', 'data', 'courseId']),
      position: null
    }, opts);

    await src.update({ originId: originActivity.id }, opts);

    const TeachingElement = this.sequelize.model('TeachingElement');
    const tes = await TeachingElement.findAll(
      { where: { activityId: src.id, detached: false } },
      { transaction }
    );
    const children = await Activity.findAll(
      { where: { parentId: src.id, detached: false } },
      { transaction }
    );

    if (tes.length) {
      await Promise.each(tes,
        te => te.update(
          { activityId: originActivity.id },
          { transaction }
        )
      );
    }

    if (children.length) {
      await Promise.each(children,
        child => child.update(
          { parentId: originActivity.id },
          { transaction }
        )
      );
    }

    const linkedActivity = await Activity.create({
      ...pick(originActivity, ['type', 'courseId']),
      position,
      parentId,
      originId: originActivity.id
    }, opts);

    return [
      src.id,
      linkedActivity.id
    ];
  }

  static async updateLinkedActivity({ originId }, body, opts) {
    return Activity.update(body, opts).then(() => {
      return Activity.getLinkedActivities(originId);
    });
  }

  static async getLinkedActivities(originId) {
    const opts = {
      where: {
        originId
      },
      include: [
        {
          model: Activity,
          as: 'origin'
        }
      ]
    };

    return Activity.findAll(opts).then(activities => {
      return activities.map(activity => {
        activity.data = activity.origin.data;
        activity.refs = activity.origin.refs;
        delete activity.origin;
        return activity;
      });
    });
  }

  link({ parentId, position }) {
    return this.sequelize.transaction(transaction =>
      Activity.linkActivities(this, parentId, position, { transaction })
    );
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

function removeAll(Model, where = {}, soft = false) {
  if (!soft) return Model.destroy({ where });
  return Model.update({ detached: true }, { where });
}

module.exports = Activity;
