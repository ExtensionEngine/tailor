'use strict';

const TABLE_NAME = 'revision';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(TABLE_NAME, {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
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
    entity: {
      type: Sequelize.ENUM(['ACTIVITY', 'COURSE', 'TEACHING_ELEMENT']),
      allowNull: false
    },
    operation: {
      type: Sequelize.ENUM(['CREATE', 'UPDATE', 'REMOVE']),
      allowNull: false
    },
    state: {
      type: Sequelize.JSONB,
      allowNull: true
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
    }
  }),
  down: queryInterface => queryInterface.dropTable(TABLE_NAME)
};
