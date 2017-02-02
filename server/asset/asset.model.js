'use strict';

/**
 * @swagger
 * definitions:
 *   Asset:
 *     type: object
 *     required:
 *     - courseId
 *     - activityId
 *     - layoutWidth
 *     - position
 *     - type
 *     - data
 *     properties:
 *       courseId:
 *         type: integer
 *         description: course owning the asset
 *       activityId:
 *         type: integer
 *         description: activity owning the asset
 *       layoutWidth:
 *         type: integer
 *         description: width of the layout column containing the asset
 *       position:
 *         type: float
 *         description: position within the array of other assets
 *       type:
 *         type: string
 *         description: asset type
 *         enum:
 *         - TEXT
 *         - IMAGE
 *         - VIDEO
 *       data:
 *         type: json
 *         description: json structure with asset data; structure dependends
 *                      on the asset type
 */

module.exports = function(sequelize, DataTypes) {
  const Asset = sequelize.define('asset', {
    layoutWidth: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    position: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 1, max: 12 }
    },
    type: {
      type: DataTypes.ENUM,
      values: ['TEXT', 'IMAGE', 'VIDEO'],
      allowNull: false
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: { notEmpty: true }
    }
  }, {
    classMethods: {
      associate(models) {
        Asset.belongsTo(models.Activity);
        Asset.belongsTo(models.Course);
      },
      deleteById(id) {
        // Wrap instance delete method into class method
        // for easier chaining.
        return this
        .findById(id)
        .then(result => {
          if (result) result.destroy();
          return result;
        });
      },
      updateById(id, updates) {
        // Wrap instance delete method into class method
        // for easier chaining.
        return this
        .findById(id)
        .then(result => {
          return result.update(updates);
        });
      },
      findAllByActivity(activityId) {
        return this.findAll({
          where: { activityId },
          order: 'position ASC'
        });
      }
    },
    freezeTableName: true
  });

  return Asset;
};
