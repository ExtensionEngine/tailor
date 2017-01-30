'use strict';

const forEach = require('lodash/forEach');
// const logger = require('../shared/logger');

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

module.exports = function (sequelize, DataTypes) {
  const Activity = sequelize.define('activity', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    type: {
      type: DataTypes.STRING, // ENUM?
      allowNull: false
    },
    position: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: { min: 0 }
    }
  }, {
    classMethods: {
      associate(models) {
        Activity.belongsTo(models.Course);
        Activity.belongsTo(Activity, { as: 'parent', foreignKey: 'parentId' });
        Activity.hasMany(Activity, { as: 'children', foreignKey: 'parentId' });
        // Activity.hasMany(models.Asset);
        // Activity.hasMany(models.Assesment);
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
              newPosition = siblings.length;
            }

            this.set('position', newPosition);

            return this.save();
          });
        });
      }
    },
    underscored: true,
    freezeTableName: true
  });

  return Activity;
};
