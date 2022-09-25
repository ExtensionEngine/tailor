'use strict';

const Promise = require('bluebird');

const TABLE_NAMES = ['user', 'comment', 'revision', 'tag'];

exports.up = async (qi, Sequelize) => {
  await qi.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  return Promise.each(TABLE_NAMES, tableName => {
    return qi.addColumn(tableName, 'uid', {
      type: Sequelize.UUID,
      unique: true,
      allowNull: false,
      defaultValue: Sequelize.literal('uuid_generate_v4()')
    });
  });
};

exports.down = qi => {
  return Promise.each(TABLE_NAMES, tableName => qi.removeColumn(tableName, 'uid'));
};
