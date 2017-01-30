'use strict';

const { course: role } = require('../../config/shared').role;

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('courseUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role: {
      type: DataTypes.ENUM(role.ADMIN, role.AUTHOR),
      defaultValue: role.AUTHOR
    }
  }, {
    tableName: 'course_user',
    underscored: true
  });
};
