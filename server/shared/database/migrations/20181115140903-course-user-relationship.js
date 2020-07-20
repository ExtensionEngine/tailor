'use strict';

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
        type: Sequelize.ENUM('COURSE_ADMIN', 'COURSE_AUTHOR')
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
    }).then(async () => {
      const table = await queryInterface.describeTable(TABLE_NAME);
      if (table.course_id.primaryKey && table.user_id.primaryKey) return;
      return queryInterface.addConstraint(TABLE_NAME, {
        name: 'course_user_pkey',
        type: 'primary key',
        fields: ['course_id', 'user_id']
      });
    });
  },
  down: queryInterface => queryInterface.dropTable(TABLE_NAME)
};
