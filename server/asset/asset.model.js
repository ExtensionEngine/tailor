'use strict';

const calculatePosition = require('../shared/util/calculatePosition');
const isNumber = require('lodash/isNumber');
const { processAsset, resolveAsset } = require('../shared/storage/helpers');
const values = require('lodash/values');

const types = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  GOMO: 'GOMO'
};

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
      values: values(types),
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
      field: 'layout_width',
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    classMethods: {
      associate(models) {
        Asset.belongsTo(models.Activity, {
          foreignKey: { name: 'activityId', field: 'activity_id' }
        });
        Asset.belongsTo(models.Course, {
          foreignKey: { name: 'courseId', field: 'course_id' }
        });
      },
      initialize() {
        const opts = { type: sequelize.QueryTypes.SELECT };
        return sequelize.query('SELECT NEXTVAL(\'asset_id_seq\')', opts)
          .then(result => Asset.build({ id: result[0].nextval }));
      },
      fetch(opt) {
        return isNumber(opt)
          ? Asset.findById(opt).then(it => it && resolveAsset(it))
          : Asset.findAll(opt).then(arr => Promise.all(arr.map(it => resolveAsset(it))));
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
            this.position = calculatePosition(this.id, index, siblings);
            return this.save({ transaction: t });
          });
        });
      }
    },
    hooks: {
      beforeCreate(asset) {
        return processAsset(asset);
      },
      beforeUpdate(asset) {
        const changed = asset.changed('data');
        return changed ? processAsset(asset) : Promise.resolve();
      }
    },
    underscored: true,
    timestamps: true,
    paranoid: true,
    freezeTableName: true
  });

  return Asset;
};
