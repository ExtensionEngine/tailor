'use strict';

const { course: role } = require('../../config/shared').role;
const { Model } = require('sequelize');

class CourseUser extends Model {
  static fields({ DATE, ENUM }) {
    return {
      role: {
        type: ENUM(role.ADMIN, role.AUTHOR),
        defaultValue: role.AUTHOR
      },
      createdAt: {
        type: DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at'
      },
      deletedAt: {
        type: DATE,
        field: 'deleted_at'
      }
    };
  }

  static options() {
    return {
      modelName: 'courseUser',
      tableName: 'course_user',
      underscored: true,
      timestamps: true,
      paranoid: true
    };
  }
}

module.exports = CourseUser;
