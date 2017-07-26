'use strict';

const hooks = require('./hooks');

module.exports = function (sequelize, DataTypes) {
  const Revision = sequelize.define('Revision', {
    entity: {
      type: DataTypes.ENUM,
      values: ['ACTIVITY', 'COURSE', 'TEACHING_ELEMENT'],
      allowNull: false
    },
    operation: {
      type: DataTypes.ENUM,
      values: ['CREATE', 'UPDATE', 'REMOVE'],
      allowNull: false
    },
    state: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: { notEmpty: true }
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {
    classMethods: {
      associate(models) {
        Revision.belongsTo(models.Course, {
          foreignKey: { name: 'courseId', field: 'course_id' }
        });
        Revision.belongsTo(models.User, {
          foreignKey: { name: 'userId', field: 'user_id' }
        });
      },
      addHooks(models) {
        hooks.add(models);
      }
    },
    tableName: 'revision'
  });

  return Revision;
};
