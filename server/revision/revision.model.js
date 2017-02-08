'use strict';

module.exports = function(sequelize, DataTypes) {
  const Revision = sequelize.define('revision', {
    resourceType: {
      type: DataTypes.ENUM,
      values: ['ASSESSMENT'],
      allowNull: false
    },
    operation: {
      type: DataTypes.ENUM,
      values: ['CREATE', 'UPDATE', 'REMOVE'],
      allowNull: false
    },
    currentValue: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate(models) {
        Revision.belongsTo(models.Course, {
          foreignKey: {
            name: 'courseId',
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
        Revision.belongsTo(models.User, {
          foreignKey: {
            name: 'userId',
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
      }
    },
    freezeTableName: true
  });

  return Revision;
};
