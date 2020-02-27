'use strict';

const TABLE_NAME = 'tag';

exports.up = (queryInterface, Sequelize) => {
  return queryInterface.createTable(TABLE_NAME, {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(20),
      unique: true,
      allowNull: false
    }
  });
};

exports.down = queryInterface => queryInterface.dropTable(TABLE_NAME);
