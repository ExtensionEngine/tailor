'use strict';

const { course: role } = require('../../config/shared').role;
const { Model } = require('sequelize');

class CourseUser extends Model {
  static fields({ BOOLEAN, DATE, ENUM, INTEGER }) {
    return {
      userId: {
        type: INTEGER,
        field: 'user_id',
        primaryKey: true,
        unique: 'course_user_pkey'
      },
      courseId: {
        type: INTEGER,
        field: 'course_id',
        primaryKey: true,
        unique: 'course_user_pkey'
      },
      role: {
        type: ENUM(role.ADMIN, role.AUTHOR),
        defaultValue: role.AUTHOR
      },
      pinned: {
        type: BOOLEAN,
        defaultValue: false
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
