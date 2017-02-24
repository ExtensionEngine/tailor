'use strict';

const calculatePosition = require('../shared/util/calculatePosition');
const { extractFileAsset } = require('../shared/storage/helpers');
const mime = require('mime-types');
const set = require('lodash/set');
const storage = require('../shared/storage');
const isNumber = require('lodash/isNumber');
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
      allowNull: false
    }
  }, {
    classMethods: {
      associate(models) {
        Asset.belongsTo(models.Activity);
        Asset.belongsTo(models.Course);
      },
      initialize() {
        const opts = { type: sequelize.QueryTypes.SELECT };
        return sequelize.query('SELECT NEXTVAL(\'asset_id_seq\')', opts)
          .then(result => Asset.build({ id: result[0].nextval }));
      },
      fetch(opt) {
        return isNumber(opt)
          ? Asset.findById(opt).then(it => it && it.resolveUrl())
          : Asset.findAll(opt).then(arr => Promise.all(arr.map(it => it.resolveUrl())));
      }
    },
    instanceMethods: {
      saveFile(key, file) {
        const options = { ACL: 'public-read', ContentType: mime.lookup(key) };
        return storage.saveFile(key, file, options).then(() => this);
      },
      resolveUrl() {
        const getUrl = key => {
          return storage.getFileUrl(key, { Expires: 3600 })
            .then(url => set(this, 'data.url', url));
        };

        return storage.fileExists(this.data.url)
          .then(exists => exists ? getUrl(this.data.url) : this);
      },
      processFiles() {
        // TODO: Add support for multiple file assets
        if (!this.data.url) return Promise.resolve(this);
        const { key, file } = extractFileAsset(this);
        this.data.url = key;
        return this.saveFile(key, file);
      },
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
        return asset.processFiles();
      },
      beforeUpdate(asset) {
        const cond = asset.type === types.IMAGE && asset.changed('data');
        return cond ? asset.processFiles() : Promise.resolve();
      }
    },
    freezeTableName: true
  });

  return Asset;
};
