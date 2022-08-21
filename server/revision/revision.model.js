import { Model, Sequelize } from 'sequelize';
import { applyFetchHooks } from '../content-element/hooks.js';
import hooks from './hooks.js';
import isNumber from 'lodash/isNumber.js';
import Promise from 'bluebird';

const { literal } = Sequelize;

class Revision extends Model {
  static fields(DataTypes) {
    const { DATE, ENUM, JSONB, UUID, UUIDV4 } = DataTypes;
    return {
      uid: {
        type: UUID,
        unique: true,
        allowNull: false,
        defaultValue: UUIDV4
      },
      entity: {
        type: ENUM,
        values: ['ACTIVITY', 'REPOSITORY', 'CONTENT_ELEMENT'],
        allowNull: false
      },
      operation: {
        type: ENUM,
        values: ['CREATE', 'UPDATE', 'REMOVE'],
        allowNull: false
      },
      state: {
        type: JSONB,
        allowNull: true,
        validate: { notEmpty: true }
      },
      createdAt: {
        type: DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at'
      }
    };
  }

  static associate({ User, Repository }) {
    this.belongsTo(Repository, {
      foreignKey: { name: 'repositoryId', field: 'repository_id' }
    });
    this.belongsTo(User, {
      foreignKey: { name: 'userId', field: 'user_id' }
    });
  }

  static scopes() {
    const tableName = this.getTableName();
    const { field: stateField } = this.rawAttributes.state;
    const entityIdRawField = `${tableName}.${stateField}->'id'`;
    return {
      lastByEntity: {
        attributes: [
          // Constant "1" prevents syntax error
          // caused by "," at the end of the DISTINCT ON expression.
          // Explicit raw attributes are added to enforce
          // order within SELECT (DISTINCT ON must be first).
          literal(`DISTINCT ON (${entityIdRawField}) 1`),
          ...Object.keys(this.rawAttributes)
        ],
        order: [[literal(entityIdRawField)], ['createdAt', 'DESC']]
      }
    };
  }

  static options() {
    return {
      modelName: 'revision',
      freezeTableName: true
    };
  }

  static hooks(Hooks, models) {
    hooks.add(this, Hooks, models);
  }

  static async fetch(query, options) {
    if (isNumber(query)) {
      const revision = await this.findByPk(query, options);
      return revision.applyFetchHooks();
    }
    const revisions = await this.findAll(query);
    return Promise.map(revisions, it => it.applyFetchHooks());
  }

  async applyFetchHooks() {
    if (this.entity !== 'CONTENT_ELEMENT') return this;
    const state = await applyFetchHooks(this.state);
    this.state = state;
    return this;
  }
}

export default Revision;
