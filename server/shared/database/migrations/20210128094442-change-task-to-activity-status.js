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

exports.up = async qi => {
  await qi.removeIndex(OLD_TABLE_NAME, [
    'column_position',
    'status',
    'repository_id'
  ], {
    unique: true
  });

  return qi.sequelize.transaction(async transaction => {
    await Promise.all(Object.keys(COLUMNS).map(removeColumn));
    return qi.renameTable(
      OLD_TABLE_NAME,
      NEW_TABLE_NAME,
      { transaction }
    );

    function removeColumn(name) {
      return qi.removeColumn(OLD_TABLE_NAME, name, { transaction });
    }
  });
};

exports.down = async qi => {
  await qi.sequelize.transaction(async transaction => {
    await Promise.all(Object.entries(COLUMNS).map(addColumn));
    await qi.renameTable(
      NEW_TABLE_NAME,
      OLD_TABLE_NAME,
      { transaction }
    );

    function addColumn([name, options]) {
      return qi.addColumn(
        NEW_TABLE_NAME,
        name,
        options,
        { transaction }
      );
    }
  });

  return qi.addIndex(OLD_TABLE_NAME, [
    'column_position',
    'status',
    'repository_id'
  ], {
    unique: true,
    where: { archived_at: null }
  });
};
