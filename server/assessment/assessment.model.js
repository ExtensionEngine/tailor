'use strict';

module.exports = function(sequelize, DataTypes) {
  const Assessment = sequelize.define('assessment', {
    type: {
      type: DataTypes.ENUM,
      values: ['MC', 'SC', 'TF', 'NR', 'TR', 'FB'],
      allowNull: false
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate(models) {
        Assessment.belongsTo(models.Course);
        Assessment.belongsTo(models.Activity, {
          foreignKey: {
            name: 'activityId',
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
      }
    },
    freezeTableName: true
  });

  return Assessment;
};
