'use strict';

const { course: role } = require('../../config/shared').role;

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('courseUser', {
    role: {
      type: DataTypes.ENUM(role.ADMIN, role.AUTHOR),
      defaultValue: role.AUTHOR
    }
  }, {
    tableName: 'course_user'
  });
};
