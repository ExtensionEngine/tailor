'use strict';

const { Model, Op } = require('sequelize');
const calculatePosition = require('../shared/util/calculatePosition');
const cloneContentElement = require('../shared/util/cloneContentElement');
const { ContentElement: Events } = require('../../common/sse');
const get = require('lodash/get');
const getFileMetas = require('../shared/util/getFileMetas');
const hooks = require('./hooks');
const isNumber = require('lodash/isNumber');
const pick = require('lodash/pick');
const { SCHEMAS } = require('../../config/shared/activities');
const storage = require('../repository/storage');

class ContentElement extends Model {
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

  static hooks(Hooks, models) {
    hooks.add(this, Hooks, models);
  }

  static scopes() {
    const notNull = { [Op.ne]: null };
    return {
      withReferences: { where: { 'refs.objectiveId': notNull } },
      publish: {
        attributes: [
          'id', 'uid', 'type', 'contentId', 'contentSignature',
          'position', 'data', 'meta', 'refs', 'createdAt', 'updatedAt'
        ],
        order: [['position', 'ASC']]
      }
    };
  }

  static options() {
    return {
      modelName: 'ContentElement',
      tableName: 'content_element',
      underscored: true,
      timestamps: true,
      paranoid: true
    };
  }

  static get Events() {
    return Events;
  }

  static fetch(opt) {
    return isNumber(opt)
      ? ContentElement.findByPk(opt).then(it => it && hooks.applyFetchHooks(it))
      : ContentElement.findAll(opt).map(hooks.applyFetchHooks);
  }

  static async cloneElements(src, container, repository, options) {
    const { id: activityId, repositoryId } = container;
    const { context, transaction } = options;
    const repositoryAssetsPath = storage.getPath(repository.id);
    const metaBySchemaType = getFileMetas(SCHEMAS);
    const metaByElementType = get(metaBySchemaType, [repository.schema, 'element']);
    const elements = await Promise.all(src.map(async it => {
      const element = pick(it, ['type', 'position', 'data', 'contentId', 'contentSignature', 'refs', 'meta']);
      const { data, meta } = await cloneContentElement(element, repositoryAssetsPath, metaByElementType);
      return Object.assign(element, { activityId, data, meta, repositoryId });
    }));
    return this.bulkCreate(elements, { returning: true, context, transaction });
  }

  /**
   * Maps references for cloned element.
   * @param {Object} mappings Dict where keys represent old and values new ids.
   * @param {SequelizeTransaction} [transaction]
   * @returns {Promise.<ContentElement>} Updated instance.
   */
  mapClonedReferences(mappings, transaction) {
    const { refs } = this;
    if (!refs.objectiveId) return Promise.resolve();
    refs.objectiveId = mappings[refs.objectiveId];
    return this.update({ refs }, { transaction });
  }

  siblings(filter = {}) {
    const where = Object.assign({}, filter, { activityId: this.activityId });
    return ContentElement.findAll({ where, order: [['position', 'ASC']] });
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

module.exports = ContentElement;
