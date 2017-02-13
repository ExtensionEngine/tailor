'use strict';

const crypto = require('crypto');
const assign = require('lodash/assign');
const isEmpty = require('lodash/isEmpty');
const isString = require('lodash/isString');
const set = require('lodash/set');
const mime = require('mime-types');
const calculatePosition = require('../shared/util/calculatePosition');
const storage = require('../shared/storage');

const DEFAULT_IMAGE_EXTENSION = 'png';

const generateS3Data = (assetId, courseId, image) => {
  const base64Pattern = /^data:image\/(\w+);base64,/;
  const file = Buffer.from(image.replace(base64Pattern, ''), 'base64');
  const extension = image.match(base64Pattern)[1] || DEFAULT_IMAGE_EXTENSION;

  const hashString = `${file}/${courseId}/${assetId}`;
  const hash = crypto.createHash('md5').update(hashString).digest('hex');

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
      findAllAndFetch(options) {
        return Asset.findAll(options)
          .then(assets => {
            return Promise.all(assets.map(a => a.getRemote()));
          });
      },
      findByIdAndFetch(id) {
        return Asset.findById(id)
          .then(asset => asset && asset.getRemote());
      }
    },
    instanceMethods: {
      getRemote() {
        const getFileUrl = key => storage.getFileUrl(key, { Expires: 3600 })
          .then(url => set(this, 'data.url', url));

        return storage.fileExists(this.data.url)
          .then(exists => exists ? getFileUrl(this.data.url) : this);
      },
      createRemote(key, file) {
        const options = { ACL: 'public-read', ContentType: mime.lookup(key) };
        return storage.saveFile(key, file, options)
          .then(() => this);
      },
      deleteRemote() {
        const deleteFile = key => storage.deleteFile(key)
          .then(() => set(this, 'data.url', ''));

        return storage.fileExists(this.data.url)
          .then(exists => exists && !isEmpty(this.data.url)
            ? deleteFile(this.data.url)
            : this);
      },
      getImageData(data) {
        const getUrl = ({ data }) => (data && data.url) && data.url;
        const [currentKey, receivedFile] = [getUrl(this), getUrl(data)];

        const { key, file } = !isEmpty(receivedFile)
          ? generateS3Data(this.id, this.courseId || data.courseId, receivedFile)
          : { key: null, file: null };

        const shouldCreate = isString(receivedFile) && !isEmpty(receivedFile) && isEmpty(currentKey);
        const shouldDelete = isEmpty(receivedFile) && !isEmpty(currentKey);
        const shouldUpdate = !isEmpty(receivedFile) && !isEmpty(currentKey);

        if (shouldCreate) {
          const method = this.createRemote(key, file);
          return { asset: assign(data, { data: { url: key } }), method };
        } else if (shouldDelete) {
          const method = this.deleteRemote(currentKey);
          return { asset: assign(data, { data: { url: null } }), method };
        } else if (shouldUpdate) {
          const shouldReplace = currentKey !== key;
          if (shouldReplace) {
            const method = storage.deleteFile(currentKey)
              .then(() => this.createRemote(key, file));
            return { asset: assign(data, { data: { url: key } }), method };
          } else {
            return { asset: assign(data, { data: { url: currentKey } }), method: null };
          }
        } else {
          if (isEmpty(currentKey)) set(data, 'data.url', null);
          return { asset: data, method: null };
        }
      },
      getTypeData(data) {
        const isImage = (this.type && this.type === 'IMAGE') || data.type === 'IMAGE';
        if (isImage) return this.getImageData(data);
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
    hooks: {
      beforeDestroy(asset) {
        // Cleanup uploaded data
        return asset.deleteRemote();
      }
    },
    freezeTableName: true
  });

  return Asset;
};
