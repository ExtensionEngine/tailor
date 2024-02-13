import { Model, Op } from 'sequelize';
import calculatePosition from '../shared/util/calculatePosition.js';
import { ContentElement as Events } from '../../common/sse.js';
import forEach from 'lodash/forEach.js';
import hooks from './hooks.js';
import isNumber from 'lodash/isNumber.js';
import pick from 'lodash/pick.js';
import zipObject from 'lodash/zipObject.js';

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
    const notEmpty = { [Op.ne]: {} };
    return {
      withReferences: { where: { refs: notEmpty } },
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

  static async cloneElements(src, container, options) {
    const { id: activityId, repositoryId } = container;
    const { context, transaction } = options;
    const newElements = await this.bulkCreate(src.map(it => {
      return Object.assign(pick(it, [
        'type',
        'position',
        'data',
        'contentId',
        'contentSignature',
        'refs',
        'meta'
      ]), { activityId, repositoryId });
    }), { returning: true, context, transaction });
    return zipObject(src.map(it => it.id), newElements.map(it => it.id));
  }

  /**
   * Maps references for cloned element.
   * @param {Object} mappings Dict where keys represent old and values new ids.
   * @param {SequelizeTransaction} [transaction]
   * @returns {Promise.<ContentElement>} Updated instance.
   */
  mapClonedReferences(mappings, transaction) {
    const { refs } = this;
    // TODO: Refactor this and extract common logic so it can be reused.
    // This logic is copied from transfer processor as import and clone logic
    // should be the same.
    forEach(refs, (values, name) => {
      forEach(values, (ref, index) => {
        const id = mappings.contentElement[ref.id];
        const outlineId = mappings.activity[ref.outlineId];
        const containerId = mappings.activity[ref.containerId];
        if (!id || !outlineId || !containerId) {
          throw new Error('Unable to resolve element refs');
        }
        refs[name][index] = { id, outlineId, containerId };
      });
    });
    this.changed('refs', true);
    return this.save({ transaction });
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

export default ContentElement;
