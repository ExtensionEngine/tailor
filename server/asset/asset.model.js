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
      validate: { min: 1, max: 1000000 }
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
      },
      track(models) {
        const Revision = models.Revision;
        Asset.hook('afterCreate', (asset, { context }) => {
          if (context && context.userId) {
            Revision.create({
              userId: context.userId,
              courseId: asset.courseId,
              resourceType: 'ASSET',
              operation: 'CREATE',
              currentValue: asset.plain()
            });
          }
        });

        Asset.hook('afterUpdate', (asset, { context }) => {
          if (context && context.userId) {
            Revision.create({
              userId: context.userId,
              courseId: asset.courseId,
              resourceType: 'ASSET',
              operation: 'UPDATE',
              currentValue: asset.plain()
            });
          }
        });

        Asset.hook('afterDestroy', (asset, { context }) => {
          if (context && context.userId) {
            Revision.create({
              userId: context.userId,
              courseId: asset.courseId,
              resourceType: 'ASSET',
              operation: 'REMOVE',
              currentValue: null
            });
          }
        });
      }
    },
    instanceMethods: {
      plain() {
        return ['id', 'courseId', 'activityId', 'type', 'data', 'position', 'layoutWidth']
          .reduce((acc, val) => { acc[val] = this[val]; return acc; }, {});
      }
    },
    freezeTableName: true
  });

  return Asset;
};
