'use strict';

const Sequelize = require('sequelize');
const Serializer = require('sequelize-to-json');
const database = require('../shared/database');

const sequelize = database.sequelize;
const ASSET_COLLECTION = database.collection.ASSET;

/**
 * @swagger
 * definitions:
 *   Asset:
 *     type: object
 *     required:
 *     - courseKey
 *     - activityKey
 *     - layoutWidth
 *     - position
 *     - type
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
 *       content:
 *         type: string
 *         description: text content entered by user; required for TEXT assets
 *       url:
 *         type: string
 *         description: URL of image or video; required for IMAGE and VIDEO assets
 */

// TODO(marko): Denormalization is ok for now,
// could be split into hierarchy later.
const Asset = sequelize.define(ASSET_COLLECTION, {
  layoutWidth: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  position: {
    type: Sequelize.FLOAT,
    allowNull: false,
    validate: { min: 1, max: 12 }
  },
  type: {
    type: Sequelize.ENUM,
    values: ['TEXT', 'IMAGE', 'VIDEO'],
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT
  },
  url: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: { isUrl: true }
  },
  // TODO(marko): hasMany on Course and Activity models.
  course_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    default: 1
  },
  activity_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    default: 1
  }
}, {
  classMethods: {
    deleteById(id) {
      // Wrap instance delete method into class method
      // for easier chaining.
      return this
        .findById(id)
        .then(result => {
          return result.destroy();
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
        where: { activity_id: activityId }
      });
    },
    serializeMany(data) {
      // Helper method used for converting query result in JSON.
      // Invoked directly on query results.
      return Serializer.serializeMany(data, this);
    }
  },
  instanceMethods: {
    serialize() {
      // Helper method used for converting query result in JSON.
      // Invoked directly on query results.
      return (new Serializer(this.Model)).serialize(this);
    }
  },
  underscored: true,
  freezeTableName: true
});

const testData = [
  { layoutWidth: 19, position: 1, type: 'IMAGE', url: 'http://lorempixel.com/200/200', course_id: 1, activity_id: 1 },
  { layoutWidth: 18, position: 2, type: 'VIDEO', url: 'http://vimeo.com/video1', course_id: 2, activity_id: 2 },
  { layoutWidth: 17, position: 3, type: 'TEXT', content: 'lorem ipsum', course_id: 3, activity_id: 3 },
  { layoutWidth: 16, position: 4, type: 'IMAGE', url: 'http://lorempixel.com/200/200', course_id: 4, activity_id: 4 }
];

Asset.sync({ force: true })
  .then(() => {
    Asset.bulkCreate(testData);
  });

module.exports = Asset;
