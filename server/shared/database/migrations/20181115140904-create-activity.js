'use strict';

const TABLE_NAME = 'activity';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(TABLE_NAME, {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    courseId: {
      type: Sequelize.INTEGER,
      field: 'course_id',
      references: { model: 'course', key: 'id' }
    },
    parentId: {
      type: Sequelize.INTEGER,
      field: 'parent_id',
      references: { model: 'activity', key: 'id' }
    },
    uid: {
      type: Sequelize.UUID,
      unique: true,
      defaultValue: Sequelize.UUIDV4
    },
    type: {
      type: Sequelize.STRING
    },
    position: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    data: {
      type: Sequelize.JSONB,
      defaultValue: {}
    },
    refs: {
      type: Sequelize.JSONB,
      defaultValue: {}
    },
    detached: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    publishedAt: {
      type: Sequelize.DATE,
      field: 'published_at'
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
