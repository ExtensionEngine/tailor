'use strict';

const isNumber = require('lodash/isNumber');
const { processAssessment, resolveAssessment } = require('../shared/storage/helpers');

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
      validate: {
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate(models) {
        Assessment.belongsTo(models.Course);
        Assessment.belongsTo(models.Activity, {
          foreignKey: { name: 'activityId', allowNull: false },
          onDelete: 'CASCADE'
        });
      },
      fetch(opt) {
        return isNumber(opt)
          ? Assessment.findById(opt).then(it => it && resolveAssessment(it))
          : Assessment.findAll(opt)
              .then(arr => Promise.all(arr.map(it => resolveAssessment(it))));
      }
    },
    hooks: {
      beforeCreate(assessment) {
        return processAssessment(assessment);
      },
      beforeUpdate(assessment) {
        const changed = assessment.changed('question');
        return changed ? processAssessment(assessment) : Promise.resolve();
      }
    },
    freezeTableName: true
  });

  return Assessment;
};
