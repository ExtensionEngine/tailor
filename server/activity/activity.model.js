'use strict';

const findIndex = require('lodash/findIndex');
const Promise = require('bluebird');
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
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.ENUM('GOAL', 'CONCEPT', 'TOPIC', 'PERSPECTIVE'),
      defaultValue: 'GOAL',
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
      remove() {
        return sequelize.transaction(t => {
          return this.deleteTree().then(() => this.destroy()).then(() => this);
        });
      },
      deleteTree() {
        return Promise.resolve(this.getChildren())
          .each(it => it.deleteTree())
          .then(() => this.deleteChildren());
      },
      deleteChildren() {
        return Activity.destroy({ where: { parentId: this.id } });
      },
      reorder(index) {
        return sequelize.transaction(t => {
          return this.siblings().then(siblings => {
            let newpos;

            if (!index) {
              newpos = siblings[0].get('position') / 2;
            } else if (index + 1 === siblings.length) {
              newpos = siblings[index].get('position') + 1;
            } else {
              const currIndex = findIndex(siblings, it => it.id === this.id);
              const inc = currIndex > index ? -1 : 1;
              const prevPos = siblings[index].get('position');
              const nextPos = siblings[index + inc].get('position');

              newpos = (nextPos + prevPos) / 2;
            }

            this.set('position', newpos);

            return this.save();
          });
        });
      }
    },
    freezeTableName: true
  });

  return Activity;
};
