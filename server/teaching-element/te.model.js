'use strict';

const calculatePosition = require('../shared/util/calculatePosition');
const forEach = require('lodash/forEach');
const get = require('lodash/get');
const hash = require('hash-obj');
const isNumber = require('lodash/isNumber');
const { Model, Op } = require('sequelize');
const pick = require('lodash/pick');
const { processStatics, resolveStatics } = require('../shared/storage/helpers');
const Promise = require('bluebird');

const pruneVirtualProps = element => {
  const assets = get(element, 'data.assets', {});
  forEach(assets, key => delete element.data[key]);
  return element;
};

class TeachingElement extends Model {
  static fields(DataTypes) {
    const { BOOLEAN, DATE, INTEGER, DOUBLE, JSONB, STRING, UUID, UUIDV4 } = DataTypes;
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
      originId: {
        type: INTEGER
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
    this.belongsTo(this, {
      as: 'origin',
      foreignKey: { name: 'originId', field: 'origin_id' }
    });
    this.hasMany(this, {
      as: 'links',
      foreignKey: { name: 'originId', field: 'origin_id' }
    });
  }

  static hooks(Hooks) {
    return {
      [Hooks.beforeFind](options) {
        return this._defaultsOptions(options, this.scopes().withOrigin);
      },
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
      async [Hooks.afterDestroy](te) {
        const { isLink, origin } = te;
        if (!isLink) return;
        const links = await origin.getLinks();
        if (links.length > 1) return;
        const [ link ] = links;
        await link.update({ originId: null, data: origin.data });
        await origin.destroy();
        return link;
      }
    };
  }

  static scopes() {
    const notNull = { [Op.ne]: null };
    return {
      withReferences: { where: { 'refs.objectiveId': notNull } },
      withOrigin: { include: [{ model: TeachingElement, as: 'origin' }] }
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

  get isLink() {
    return this.originId && this.origin;
  }

  update(values, options) {
    if (!this.isLink || options.revertLink) {
      return super.update(values, options)
      .then(element => resolveStatics(element));
    }

    return this.origin.update({ ...values, position: null }, options)
      .then(origin => resolveStatics(origin))
      .then(origin => origin.getLinks({ where: { id: this.id } }))
      .then(elements => elements[0]);
  }

  static fetch(opt) {
    return isNumber(opt)
      ? TeachingElement.findByPk(opt).then(it => resolveStatics(it))
      : TeachingElement.findAll(opt)
        .then(arr => Promise.all(arr.map(it => resolveStatics(it))));
  }

  static cloneOrigins(source, courseId, tesOriginIdMap, transaction) {
    return Promise.reduce(source, async (acc, element) => {
      if (!element.isLink) return acc;
      if (acc[element.originId]) {
        acc[element.originId].links = acc[element.originId].links + 1;
        return acc;
      }
      const data = pick(element.origin, [
        'type',
        'position',
        'data',
        'contentId',
        'contentSignature',
        'refs',
        'meta'
      ]);
      const clonedOrigin = await this.create({
        ...data,
        courseId,
        activityId: null,
        position: null
      }, { returning: true, transaction });
      acc[element.originId] = { id: clonedOrigin.id, links: 1 };
      return acc;
    }, tesOriginIdMap);
  }

  static async resolveClonedOrigins({
    transaction,
    tesOriginIdMap
  }) {
    const originsWithOneLink = Object.values(tesOriginIdMap)
      .reduce((acc, origin) => {
        if (origin.links === 1) acc.push(origin.id);
        return acc;
      }, []);
    if (!originsWithOneLink.length) return;
    await Promise.each(originsWithOneLink, async id => {
      const origin = await this.findOne({
        where: { id },
        transaction
      });
      const [ link ] = await origin.getLinks({ transaction });
      await link.update(
        { originId: null, data: origin.data },
        { transaction, revertLink: true }
      );
      await origin.destroy({ transaction });
    });
  }

  static async cloneElements(elements, container, options) {
    const { transaction, cloneOrigins } = options;
    let { tesOriginIdMap = {} } = options;
    const { id: activityId, courseId } = container;
    if (cloneOrigins) {
      tesOriginIdMap = await this.cloneOrigins(elements, courseId, tesOriginIdMap, transaction);
    }
    const items = elements.map(element => {
      let data = pick(element, [
        'type',
        'position',
        'data',
        'contentId',
        'contentSignature',
        'refs',
        'meta'
      ]);

      if (!element.isLink) return { ...data, activityId, courseId };

      let tesOriginId = element.originId;
      if (cloneOrigins && tesOriginIdMap[element.originId]) {
        tesOriginId = tesOriginIdMap[element.originId].id;
      }

      return {
        ...data,
        data: {},
        activityId,
        courseId,
        originId: tesOriginId
      };
    });
    await this.bulkCreate(items, { returning: true, transaction });
    return tesOriginIdMap;
  }

  static linkElements(elements, container, transaction) {
    const { id: activityId, courseId } = container;
    return Promise.each(elements, async element => {
      const props = pick(element, [
        'type',
        'position',
        'data',
        'contentId',
        'originId',
        'contentSignature',
        'refs',
        'meta'
      ]);

      if (element.isLink) {
        return TeachingElement.create({
          ...props,
          activityId,
          courseId
        }, { transaction });
      }

      const origin = await TeachingElement.create({
        ...props,
        activityId: null,
        position: null
      }, { transaction });

      element.originId = origin.id;
      element.data = {};
      await element.save();

      return TeachingElement.create({
        ...props,
        data: {},
        originId: origin.id,
        activityId,
        courseId
      }, { transaction });
    });
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
      return { type: { [Op.not]: this.type } };
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

module.exports = TeachingElement;
