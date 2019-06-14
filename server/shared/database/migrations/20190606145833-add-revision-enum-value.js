'use strict';

const replaceEnum = require('sequelize-replace-enum-postgres').default;

const options = {
  tableName: 'revision',
  columnName: 'operation',
  enumName: 'enum_revision_operation'
};

module.exports = {
  up: queryInterface => replaceEnum({
    queryInterface,
    ...options,
    newValues: ['CREATE', 'UPDATE', 'REMOVE', 'RESTORE']
  }),
  down: queryInterface => replaceEnum({
    queryInterface,
    ...options,
    newValues: ['CREATE', 'UPDATE', 'REMOVE']
  })
};
