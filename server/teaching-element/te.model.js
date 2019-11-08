'use strict';

const { Model, Op } = require('sequelize');
const { processStatics, resolveStatics } = require('../shared/storage/helpers');
const calculatePosition = require('../shared/util/calculatePosition');
const forEach = require('lodash/forEach');
const get = require('lodash/get');
const hash = require('hash-obj');
const isNumber = require('lodash/isNumber');
const pick = require('lodash/pick');

const pruneVirtualProps = element => {
  const assets = get(element, 'data.assets', {});
  forEach(assets, key => delete element.data[key]);
  return element;
};

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

  static associate({ Activity, Repository }) {
    this.belongsTo(Activity, {
      foreignKey: { name: 'activityId', field: 'activity_id' }
    });
    this.belongsTo(Repository, {
      foreignKey: { name: 'repositoryId', field: 'repository_id' }
    });
  }

  static hooks(Hooks) {
    return {
      [Hooks.beforeCreate](te) {
        pruneVirtualProps(te);
        te.contentSignature = hash(te.data, { algorithm: 'sha1' });
        return processStatics(te);
      },
      [Hooks.beforeUpdate](te) {
        pruneVirtualProps(te);
        if (!te.changed('data')) return Promise.resolve();
        te.contentSignature = hash(te.data, { algorithm: 'sha1' });
        return processStatics(te);
      },
      [Hooks.afterCreate](te) {
        return resolveStatics(te);
      },
      [Hooks.afterUpdate](te) {
        return resolveStatics(te);
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
      : TeachingElement.findAll(opt).map(resolveStatics);
  }

  static cloneElements(src, container, transaction) {
    const { id: activityId, repositoryId } = container;
    return this.bulkCreate(src.map(it => {
      return Object.assign(pick(it, [
        'type',
        'position',
        'data',
        'contentId',
        'contentSignature',
        'refs',
        'meta'
      ]), { activityId, repositoryId });
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
      return { type: { [Op.not]: 'ASSESSMENT' } };
    });
  }
}

module.exports = TeachingElement;
