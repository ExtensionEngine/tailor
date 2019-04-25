'use strict';

const { Op } = require('sequelize');
const uniq = require('lodash/uniq');

const SCOPE = 'withReferences';

const noop = () => {};
const notNull = { [Op.ne]: null };

const jsonPath = (...segments) => segments.join('.');

module.exports = Model => {
  const { fields = noop, scopes = noop } = Model;
  return Object.assign(Model, {
    fields(DataTypes, sequelize) {
      const { JSONB } = DataTypes;
      const baseFields = fields.call(Model, DataTypes, sequelize);
      return Object.assign({}, baseFields, {
        refs: {
          type: JSONB,
          defaultValue: {}
        }
      });
    },
    scopes(models) {
      const baseScopes = scopes.call(Model, models);
      return Object.assign({}, baseScopes, {
        [SCOPE](relationships = []) {
          relationships = uniq(relationships);
          const conds = relationships.map(relationshipType => {
            const path = jsonPath('refs', relationshipType);
            return { [path]: notNull };
          });
          const where = { [Op.or]: conds };
          return { where };
        }
      });
    },
    withRelationships: wrapScope(Model, SCOPE)
  });
};

function wrapScope(Model, scope) {
  return (...args) => Model.scope({ method: [scope, ...args] });
}
