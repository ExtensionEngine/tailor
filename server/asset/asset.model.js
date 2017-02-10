'use strict';

const crypto = require('crypto');
const assign = require('lodash/assign');
const isEmpty = require('lodash/isEmpty');
const isString = require('lodash/isString');
const set = require('lodash/set');
const calculatePosition = require('../shared/util/calculatePosition');
const storage = require('../shared/storage');

const DEFAULT_IMAGE_EXTENSION = 'png';

// TODO(marko): Add as 'static' method on the model?
const generateS3Data = (assetId, courseId, image) => {
  const base64Pattern = /^data:image\/(\w+);base64,/;
  const extension = image.match(base64Pattern)[1] || DEFAULT_IMAGE_EXTENSION;

  const hashString = `${courseId}/${assetId}`;
  const hash = crypto.createHash('md5').update(hashString).digest('hex');

  const file = Buffer.from(image.replace(base64Pattern, ''), 'base64');
  const key = `/course/${courseId}/asset/${hash}.${extension}`;
  return { file, key };
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
      },
      initialize() {
        return sequelize.query(
            'SELECT NEXTVAL(\'asset_id_seq\')',
            { type: sequelize.QueryTypes.SELECT })
          .then(result => Asset.build(
            { id: result[0].nextval }
          ));
      },
      findByIdAndFetch(id) {
        return Asset
          .findById(id)
          .then(asset => asset && asset.getRemote());
      }
    },
    instanceMethods: {
      getRemote() {
        const asset = this;
        const getFileUrl = key => storage.getFileUrl(key)
          .then(url => set(asset, 'data.url', url));

        return storage.fileExists(this.data.url)
          .then(exists => exists ? getFileUrl(this.data.url) : this);
      },
      createRemote(key, file) {
        // TODO(marko): Internal helper method, hide from instance somehow?
        const asset = this; // Asset should be passed in as argument.
        return storage.saveFile(key, file)
          .then(() => asset);
      },
      deleteRemote() {
        // TODO(marko): Internal helper method, hide from instance somehow?
        const asset = this; // Asset should be passed in as argument.
        const deleteFile = key => storage.deleteFile(key)
          .then(() => set(asset, 'data.url', ''));

        return storage.fileExists(asset.data.url)
          .then(exists => exists && !isEmpty(asset.data.url)
            ? deleteFile(asset.data.url)
            : asset);
      },
      getImageData(data) {
        // TODO(marko): Internal helper method, hide from instance somehow?
        const asset = this; // Asset should be passed in as argument.
        const getUrl = ({ data }) => (data && data.url) && data.url;
        const [currKey, currFile] = [getUrl(asset), getUrl(data)];

        const { key, file } = !isEmpty(currFile)
          ? generateS3Data(asset.id, asset.courseId || data.courseId, currFile)
          : { key: null, file: null };

        const shouldCreate = isString(currFile) && !isEmpty(currFile) && isEmpty(currKey);
        const shouldDelete = isString(currFile) && isEmpty(currFile) && !isEmpty(currKey);
        const shouldUpdate = !isEmpty(currFile) && !isEmpty(currKey);

        if (shouldCreate) {
          const method = asset.createRemote(key, file);
          return { asset: assign(data, { data: { url: key } }), method };
        } else if (shouldDelete) {
          const method = asset.deleteRemote(currKey);
          return { asset: assign(data, { data: { url: null } }), method };
        } else if (shouldUpdate) {
          const shouldReplace = currKey !== key;
          if (shouldReplace) {
            const method = storage.deleteFile(currKey)
              .then(() => asset.createRemote(key, file));
            return { asset: assign(data, { data: { url: key } }), method };
          } else {
            return { asset: assign(data, { data: { url: currKey } }), method: null };
          }
        } else {
          if (isEmpty(currKey)) set(data, 'data.url', null);
          return { asset: data, method: null };
        }
      },
      getTypeData(data) {
        // TODO(marko): Internal helper method, hide from instance somehow?
        const asset = this; // Asset should be passed in as argument.
        const isImage = (asset.type && asset.type === 'IMAGE') || data.type === 'IMAGE';
        if (isImage) return asset.getImageData(data);
        return { asset: data, method: null };
      },
      saveAndUpload(data) {
        const { asset, method: callRemote } = this.getTypeData(data);
        const instance = callRemote
          ? callRemote.then(() => assign(this, asset).save())
          : assign(this, asset).save();

        return instance.then(asset => asset.getRemote());
      },
      destroyWithRemote() {
        return this.deleteRemote()
          .then(asset => asset.destroy());
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
    freezeTableName: true
  });

  return Asset;
};
