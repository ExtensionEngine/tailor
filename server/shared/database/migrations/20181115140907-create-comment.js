'use strict';

const TABLE_NAME = 'comment';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(TABLE_NAME, {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    authorId: {
      type: Sequelize.INTEGER,
      field: 'author_id',
      references: { model: 'user', key: 'id' },
      allowNull: false
    },
    activityId: {
      type: Sequelize.INTEGER,
      field: 'activity_id',
      references: { model: 'activity', key: 'id' },
      allowNull: false
    },
    courseId: {
      type: Sequelize.INTEGER,
      field: 'course_id',
      references: { model: 'course', key: 'id' },
      allowNull: false
    },
    content: {
      type: Sequelize.TEXT,
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
  }),
  down: queryInterface => queryInterface.dropTable(TABLE_NAME)
};
