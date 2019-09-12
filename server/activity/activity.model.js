'use strict';

const { getSiblingLevels } = require('../../config/shared/activities');
const { Model, Op } = require('sequelize');
const calculatePosition = require('../shared/util/calculatePosition');
const withActivityHelper = require('./activity.helper');

class Activity extends withActivityHelper(Model) {
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

  static hooks(Hooks) {
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
    return this.links && this.links.length;
  }

  /**
   * @param {Object} options
   * @param {Number} options.courseId
   * @param {Number} options.parentId
   * @param {Number} options.position
   * @param {Boolean} options.shouldCloneOrigins
   * @param {Boolean} options.isLinkingEnabled
   * @returns {Promise}
   */
  clone(options) {
    return this.sequelize.transaction(transaction => {
      return Activity.cloneActivities([this], { ...options, transaction });
    });
  }

  /**
   * Link activity
   * @param {Object} options
   * @param {Number} options.parentId
   * @param {Number} options.position
   * @param {Number} options.originParentId
   */
  link(options) {
    return this.sequelize.transaction(transaction => {
      return Activity.linkActivities(this, { ...options, transaction });
    });
  }

  remove(options = {}) {
    return this.sequelize.transaction(transaction => {
      return Activity.removeActivity(this, { ...options, transaction });
    });
  }

  /**
   * @param {Object} options
   */
  removeLink(options = {}) {
    return this.sequelize.transaction(transaction => {
      return Activity.removeLinkedActivity(this, { ...options, transaction });
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
    if (!this.isLink && !this.isOrigin) return { ...values, isOrigin: false };
    if (this.isOrigin) {
      this.links.forEach(link => { link.data = this.data; });
      return { ...values, isOrigin: true, links: this.links };
    }
    const { data, refs } = this.origin;
    return { ...values, isOrigin: false, data, refs };
  }
}

module.exports = Activity;
