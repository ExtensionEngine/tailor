'use strict';

const calculatePosition = require('../shared/util/calculatePosition');
const hash = require('hash-obj');
const isNumber = require('lodash/isNumber');
const { Model } = require('sequelize');
const pick = require('lodash/pick');
const { processStatics, resolveStatics } = require('../shared/storage/helpers');

class TeachingElement extends Model {
  static fields(DataTypes) {
    const { BOOLEAN, DATE, DOUBLE, JSONB, STRING, UUID, UUIDV4 } = DataTypes;
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
        validate: { min: 0, max: 1000000 }
      },
      contentId: {
        type: UUID,
        field: 'content_id',
        defaultValue: UUIDV4
      },
      contentSignature: {
        type: STRING(40),
        field: 'content_signature',
        validate: { notEmpty: true }
      },
      data: {
        type: JSONB
      },
      meta: {
        type: JSONB
      },
      refs: {
        type: JSONB,
        defaultValue: {}
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

  static hooks() {
    return {
      beforeCreate(te) {
        te.contentSignature = hash(te.data, { algorithm: 'sha1' });
        return processStatics(te);
      },
      beforeUpdate(te) {
        if (!te.changed('data')) return Promise.resolve();
        te.contentSignature = hash(te.data, { algorithm: 'sha1' });
        return processStatics(te);
      }
    };
  }

  static scopes({ Op }) {
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
      ? TeachingElement.findById(opt).then(it => it && resolveStatics(it))
      : TeachingElement.findAll(opt)
          .then(arr => Promise.all(arr.map(it => resolveStatics(it))));
  }

  static cloneElements(src, container, transaction) {
    const { id: activityId, courseId } = container;
    return this.bulkCreate(src.map(it => {
      return Object.assign(pick(it, [
        'type', 'position', 'data', 'contentId', 'contentSignature', 'refs'
      ]), { activityId, courseId });
    }), { returning: true, transaction });
  }

  /**
   * Maps references for cloned element.
   * @param {Object} mappings Dict where keys represent old and values new ids.
   * @param {SequelizeTransaction} [transaction]
   * @returns {Promise.<TeachingElement>} Updated instance.
   */
  mapClonedReferences(mappings, transaction) {
    const { refs } = this;
    if (!refs.objectiveId) return Promise.resolve();
    refs.objectiveId = mappings[refs.objectiveId];
    return this.update({ refs }, { transaction });
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
      return { type: { $not: this.type } };
    });
  }
}

module.exports = TeachingElement;
