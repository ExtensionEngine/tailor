'use strict';

module.exports = function(sequelize, DataTypes) {
  const Revision = sequelize.define('revision', {
    resourceType: {
      type: DataTypes.ENUM,
      values: ['ACTIVITY', 'ASSET', 'COURSE'],
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
      validate: {
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate(models) {
        Revision.belongsTo(models.Course, {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
        Revision.belongsTo(models.User, {
          foreignKey: {
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
