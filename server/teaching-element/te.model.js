'use strict';

const calculatePosition = require('../shared/util/calculatePosition');
const forEach = require('lodash/forEach');
const get = require('lodash/get');
const hash = require('hash-obj');
const isEmpty = require('lodash/isEmpty');
const isNumber = require('lodash/isNumber');
const { Model, Op } = require('sequelize');
const { processStatics, resolveStatics } = require('../shared/storage/helpers');
const withCloneView = require('../shared/database/mixins/withCloneView');

const pruneVirtualProps = element => {
  const assets = get(element, 'data.assets', {});
  forEach(assets, key => delete element.data[key]);
  return element;
};

class TeachingElement extends Model {
  static get mixins() {
    return [withCloneView];
  }

  static fields(DataTypes) {
    const { BOOLEAN, DATE, DOUBLE, JSONB, STRING, UUID, UUIDV4 } = DataTypes;
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
        validate: { min: 0, max: 1000000 },
        meta: { clone: true }
      },
      contentId: {
        type: UUID,
        field: 'content_id',
        defaultValue: UUIDV4,
        meta: { clone: true }
      },
      contentSignature: {
        type: STRING(40),
        field: 'content_signature',
        validate: { notEmpty: true },
        meta: { clone: true }
      },
      data: {
        type: JSONB,
        meta: { clone: true }
      },
      meta: {
        type: JSONB
      },
      refs: {
        type: JSONB,
        defaultValue: {},
        meta: { clone: true }
      },
      linked: {
        type: BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      detached: {
        type: BOOLEAN,
        defaultValue: false,
        allowNull: false
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

  static associate({ Activity, Course }) {
    this.belongsTo(Activity, {
      foreignKey: { name: 'activityId', field: 'activity_id' }
    });
    this.belongsTo(Course, {
      foreignKey: { name: 'courseId', field: 'course_id' }
    });
  }

  static hooks(Hooks) {
    const { HookType } = Hooks;
    Hooks.register('afterBulkClone');
    return {
      [HookType.beforeCreate](te) {
        pruneVirtualProps(te);
        te.contentSignature = hash(te.data, { algorithm: 'sha1' });
        return processStatics(te);
      },
      [HookType.beforeUpdate](te) {
        pruneVirtualProps(te);
        if (!te.changed('data')) return Promise.resolve();
        te.contentSignature = hash(te.data, { algorithm: 'sha1' });
        return processStatics(te);
      }
    };
  }

  static scopes() {
    const notNull = { [Op.ne]: null };
    return {
      withReferences: { where: { 'refs.objectiveId': notNull } }
    };
  }

  static options() {
    return {
      modelName: 'TeachingElement',
      tableName: 'teaching_element',
      underscored: true,
      timestamps: true,
      paranoid: true
    };
  }

  static fetch(opt) {
    return isNumber(opt)
      ? TeachingElement.findByPk(opt).then(it => it && resolveStatics(it))
      : TeachingElement.findAll(opt)
          .then(arr => Promise.all(arr.map(it => resolveStatics(it))));
  }

  static async cloneElements(tes, container, options) {
    const { id: activityId, courseId } = container;
    const { views } = this;
    const items = tes.map(it => ({ ...views.clone(it), activityId, courseId }));
    const clonedTes = await this.bulkCreate(items, { ...options, returning: true });
    if (!isEmpty(clonedTes)) {
      await this.runHooks('afterBulkClone', clonedTes, options);
    }
    return clonedTes;
  }

  /**
   * Maps references for cloned element.
   * @param {Object} mappings Dict where keys represent old and values new ids.
   * @param {Object} options
   * @returns {Promise.<TeachingElement>} Updated instance.
   */
  mapClonedReferences(mappings, options) {
    const { refs } = this;
    if (!refs.objectiveId) return Promise.resolve();
    refs.objectiveId = mappings[refs.objectiveId];
    return this.update({ refs }, options);
  }

  siblings(filter = {}) {
    const where = Object.assign({}, filter, { activityId: this.activityId });
    return TeachingElement.findAll({ where, order: [['position', 'ASC']] });
  }

  reorder(index) {
    return this.sequelize.transaction(t => {
      return this.getReorderFilter()
        .then(filter => this.siblings(filter))
        .then(siblings => {
          this.position = calculatePosition(this.id, index, siblings);
          return this.save({ transaction: t });
        });
    });
  }

  getReorderFilter() {
    return this.getActivity().then(parent => {
      if (parent.type !== 'ASSESSMENT_GROUP') return {};
      if (this.type === 'ASSESSMENT') return { type: 'ASSESSMENT' };
      return { type: { [Op.not]: this.type } };
    });
  }
}

module.exports = TeachingElement;
