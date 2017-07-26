'use strict';

const { course: role } = require('../../config/shared').role;

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('CourseUser', {
    role: {
      type: DataTypes.ENUM(role.ADMIN, role.AUTHOR),
      defaultValue: role.AUTHOR
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    underscored: true,
    timestamps: true,
    paranoid: true,
    tableName: 'course_user'
  });
};
