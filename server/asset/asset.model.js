'use strict';

const updatePostion = require('../shared/util/reorder');

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

module.exports = function (sequelize, DataTypes) {
  const Asset = sequelize.define('asset', {
    type: {
      type: DataTypes.ENUM,
      values: ['TEXT', 'IMAGE', 'VIDEO', 'GOMO'],
      allowNull: false
    },
    data: {
      type: DataTypes.JSON
    },
    position: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0, max: 1000000 }
    },
    layoutWidth: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      associate(models) {
        Asset.belongsTo(models.Activity);
        Asset.belongsTo(models.Course);
      }
    },
    instanceMethods: {
      siblings() {
        return Asset.findAll({
          where: { activityId: this.activityId },
          order: 'position ASC'
        });
      },
      reorder(index) {
        return sequelize.transaction(t => {
          return this.siblings().then(siblings => {
            this.position = updatePostion(index, siblings, this.id);
            return this.save({ transaction: t });
          });
        });
      }
    },
    freezeTableName: true
  });

  return Asset;
};
