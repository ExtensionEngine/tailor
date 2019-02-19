'use strict';

const { course: role } = require('../../../../config/shared').role;

const TABLE_NAME = 'course_user';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      userId: {
        type: Sequelize.INTEGER,
        field: 'user_id',
        references: { model: 'user', key: 'id' },
        allowNull: false
      },
      courseId: {
        type: Sequelize.INTEGER,
        field: 'course_id',
        references: { model: 'course', key: 'id' },
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM(role.ADMIN, role.AUTHOR),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        field: 'deleted_at'
      }
    }).then(() => queryInterface.addConstraint(
      TABLE_NAME,
      ['user_id', 'course_id'],
      { type: 'primary key', name: 'course_user_pkey' }
    ));
  },
  down: queryInterface => queryInterface.dropTable(TABLE_NAME)
};
