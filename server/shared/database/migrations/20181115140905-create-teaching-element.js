'use strict';

const TABLE_NAME = 'teaching_element';

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
    activityId: {
      type: Sequelize.INTEGER,
      field: 'activity_id',
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
      type: Sequelize.DOUBLE
    },
    contentId: {
      type: Sequelize.UUID,
      field: 'content_id',
      defaultValue: Sequelize.UUIDV4
    },
    contentSignature: {
      type: Sequelize.STRING(40),
      field: 'content_signature'
    },
    data: {
      type: Sequelize.JSONB,
      defaultValue: {}
    },
    refs: {
      type: Sequelize.JSONB,
      defaultValue: {}
    },
    linked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    detached: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
