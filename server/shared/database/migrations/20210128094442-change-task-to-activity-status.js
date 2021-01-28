'use strict';

const { Sequelize } = require('sequelize');

const OLD_TABLE_NAME = 'task';
const NEW_TABLE_NAME = 'activity_status';

const COLUMNS = {
  uid: {
    type: Sequelize.UUID,
    unique: true,
    allowNull: false,
    defaultValue: Sequelize.literal('uuid_generate_v4()')
  },
  author_id: {
    type: Sequelize.INTEGER,
    references: { model: 'user', key: 'id' }
  },
  repository_id: {
    type: Sequelize.INTEGER,
    references: { model: 'repository', key: 'id' }
  },
  column_position: {
    type: Sequelize.FLOAT
  },
  archived_at: {
    type: Sequelize.DATE
  }
};

exports.up = async (queryInterface, Sequelize) => {
  await queryInterface.removeIndex(OLD_TABLE_NAME, [
    'column_position',
    'status',
    'repository_id'
  ], {
    unique: true
  });
  await Promise.all(Object.keys(COLUMNS).map(removeColumn));
  return queryInterface.renameTable(OLD_TABLE_NAME, NEW_TABLE_NAME);

  function removeColumn(name) {
    return queryInterface.removeColumn(OLD_TABLE_NAME, name);
  }
};

exports.down = async (queryInterface, Sequelize) => {
  await Promise.all(Object.entries(COLUMNS).map(addColumn));
  await queryInterface.renameTable(NEW_TABLE_NAME, OLD_TABLE_NAME);
  return queryInterface.addIndex(OLD_TABLE_NAME, [
    'column_position',
    'status',
    'repository_id'
  ], {
    unique: true,
    where: { archived_at: null }
  });

  function addColumn([name, options]) {
    return queryInterface.addColumn(NEW_TABLE_NAME, name, options);
  }
};
