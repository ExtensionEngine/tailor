'use strict';

const VALUE = 'RESTORE';
const TYPENAME = 'enum_revision_operation';

function addValue(queryInterface, value) {
  const { sequelize } = queryInterface;
  const query = 'ALTER TYPE enum_revision_operation ADD VALUE :value;';
  const opts = { replacements: { value } };
  return sequelize.query(query, opts);
}

function removeValue(queryInterface, value, typename) {
  const { sequelize } = queryInterface;
  const query = `DELETE FROM pg_enum
        WHERE enumlabel = :value
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = :typename)`;
  const opts = { replacements: { value, typename } };
  return sequelize.query(query, opts);
}

module.exports = {
  up: queryInterface => addValue(queryInterface, VALUE),
  down: queryInterface => removeValue(queryInterface, VALUE, TYPENAME)
};
