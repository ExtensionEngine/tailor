'use strict';

const forEach = require('lodash/forEach');
const database = require('../shared/database');
const logger = require('../shared/logger');

const Sequelize = require('sequelize');
const sequelize = database.sequelize;

/**
 * @swagger
 * definitions:
 *   ActivityInput:
 *     type: object
 *     required:
 *     - name
 *     properties:
 *       name:
 *         type: string
 *         description: activity title
 *       parentKey:
 *         type: string
 *         description: key to the parent activity, or null for root activities
 *       position:
 *         type: integer
 *         description: position within the array of sibling activities. If not
 *                      set, the server will auto-generate correct position.
 *   ActivityReorderInput:
 *     type: object
 *     required:
 *     - position
 *     properties:
 *       position:
 *         type: integer
 *         description: non-negative integer representing the new position
 *   ActivityOutput:
 *     type: object
 *     required:
 *     - _key
 *     - courseKey
 *     - parentKey
 *     - name
 *     - position
 *     properties:
 *       _key:
 *         type: string
 *         description: unique activity identifier
 *       courseKey:
 *         type: string
 *         description: id of the course containing this activity
 *       parentKey:
 *         type: string
 *         description: key to the parent activity, or null for root activities
 *       name:
 *         type: string
 *         description: activity title
 *       position:
 *         type: integer
 *         description: position within the array of sibling activities
 */

const Activity = sequelize.define('activity', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  type: {
    type: Sequelize.STRING, // ENUM?
    allowNull: false
  },
  position: {
    type: Sequelize.DOUBLE,
    allowNull: false,
    validate: { min: 0 }
  },
  parentId: { // TEMP
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  courseId: { // TEMP
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
}, {
  classMethods: {
    findById(id) {
      return this.findOne({
        where: { id }
      });
    },
    findByCourseAndOrder(courseId) {
      return this.findAll({
        where: { courseId },
        order: 'position ASC'
      });
    }
  },
  instanceMethods: {
    siblings() {
      return Activity.findAll({
        where: {
          $and: [
            { parentId: this.parentId },
            { courseId: this.courseId }
          ]
        },
        order: 'position ASC'
      });
    },
    deleteTree() { // transaction
      this.getSubactivities()
        .then((subactivities) => {
          const promises = [];

          forEach(subactivities, (subactivity) => {
            promises.push(subactivity.deleteTree());
          });

          return Promise.all(promises);
        })
        .then(() => {
          return this.deleteSubactivities();
        });
    },
    deleteSubactivities() { // recursion
      return Activity.destroy({
        where: { parentId: this.id }
      });
    },
    reorder(newPosition) {
      return sequelize.transaction((t) => {
        return this.siblings().then((siblings) => {
          const currentActivity = siblings[newPosition - 1];

          if (currentActivity) {
            const nextPosition = currentActivity.get('position');
            let prevPosition = newPosition - 2;

            prevPosition = prevPosition + 1 > 0
                            ? prevPosition = siblings[prevPosition].get('position')
                            : prevPosition = 0;

            newPosition = (nextPosition + prevPosition) / 2;
          } else {
            newPosition = siblings.length + 1;
          }

          this.set('position', newPosition);

          return this.save();
        });
      });
    }
  }
});

// Activity.belongsTo(Course);

/* Activity.hasMany(Activity, {
  as: 'Subactivities',
  foreignKey: 'parentId'
}); */

// Activity.hasMany(Asset);
// Activity.hasMany(Assesment);

// Temporary tesing data

const tempActivities = [
  { name: 'first', type: 'basic', position: 1 },
  { name: 'second', type: 'basic', position: 2 },
  { name: 'third', type: 'basic', position: 3 },
  { name: 'fourth', type: 'basic', position: 4 },
  { name: 'fifth', type: 'basic', position: 5 }
];

Activity
  .sync({ force: true })
  .then(() => {
    return Activity.bulkCreate(tempActivities);
  })
  .then(() => {
    Activity
      .findAll({ order: 'position ASC' })
      .then((activities) => {
        forEach(activities, (activity) => {
          logger.info(activity.get('name'), activity.get('position'));
        });

        return Activity.findOne({
          where: { name: 'fourth' }
        })
        .then((activity) => {
          return activity.reorder(3);
        })
        .then(() => {
          return Activity.findAll({ order: 'position ASC' })
          .then((activities) => {
            forEach(activities, (activity) => {
              logger.info(activity.get('name'), activity.get('position'));
            });
          });
        });
      });
  });

module.exports = Activity;
