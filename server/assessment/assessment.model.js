'use strict';

module.exports = function (sequelize, DataTypes) {
  const Assessment = sequelize.define('assessment', {
    type: {
      type: DataTypes.ENUM,
      values: ['MC', 'SC', 'TF', 'NR', 'TR', 'FB', 'HS'],
      allowNull: false
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: { notEmpty: true }
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },
    deleteAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    classMethods: {
      associate(models) {
        Assessment.belongsTo(models.Course, {
          foreignKey: { name: 'courseId', field: 'course_id' }
        });
        Assessment.belongsTo(models.Activity, {
          foreignKey: { name: 'activityId', field: 'activity_id' }
        });
      }
    },
    underscored: true,
    timestamps: true,
    paranoid: true,
    freezeTableName: true
  });

  return Assessment;
};
