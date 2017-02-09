'use strict';

const findIndex = require('lodash/findIndex');
const Promise = require('bluebird');

/**
 * @swagger
 * definitions:
 *   ActivityInput:
 *     type: object
 *     required:
 *     - type
 *     properties:
 *       name:
 *         type: string
 *         description: activity title
 *       type:
 *         type: string
 *         description: activity type
 *       parentId:
 *         type: integer
 *         description: id of parent activity, null for root activities
 *       position:
 *         type: float
 *         description: position within the array of sibling activities.
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
 *     - id
 *     - courseId
 *     - parentId
 *     - type
 *     - position
 *     properties:
 *       id:
 *         type: integer
 *         description: unique activity identifier
 *       courseId:
 *         type: integer
 *         description: id of the course containing this activity
 *       parentId:
 *         type: integer
 *         description: id of parent activity, null for root activities
 *       name:
 *         type: string
 *         description: activity title
 *       position:
 *         type: float
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
        Activity.hasMany(models.Asset);
        // Activity.hasMany(models.Assesment);
      },
      track(models) {
        const Revision = models.Revision;
        Activity.hook('afterCreate', (activity, { context }) => {
          if (context && context.userId) {
            Revision.create({
              userId: context.userId,
              courseId: activity.courseId,
              resourceType: 'ACTIVITY',
              operation: 'CREATE',
              currentValue: activity.plain()
            });
          }
        });

        Activity.hook('afterUpdate', (activity, { context }) => {
          if (context && context.userId) {
            Revision.create({
              userId: context.userId,
              courseId: activity.courseId,
              resourceType: 'ACTIVITY',
              operation: 'UPDATE',
              currentValue: activity.plain()
            });
          }
        });

        Activity.hook('afterDestroy', (activity, { context }) => {
          if (context && context.userId) {
            Revision.create({
              userId: context.userId,
              courseId: activity.courseId,
              resourceType: 'ACTIVITY',
              operation: 'REMOVE',
              currentValue: null
            });
          }
        });
      }
    },
    instanceMethods: {
      plain() {
        return ['id', 'courseId', 'parentId', 'name', 'type', 'position']
          .reduce((acc, val) => { acc[val] = this[val]; return acc; }, {});
      },
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
          return this.deleteTree()
            .then(() => this.destroy())
            .then(() => this);
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
              newpos = siblings[0].position / 2;
            } else if (index + 1 === siblings.length) {
              newpos = siblings[index].position + 1;
            } else {
              const currentIndex = findIndex(siblings, it => it.id === this.id);
              const direction = currentIndex > index ? -1 : 1;
              const prevPos = siblings[index].position;
              const nextPos = siblings[index + direction].position;
              newpos = (nextPos + prevPos) / 2;
            }

            this.position = newpos;
            return this.save();
          });
        });
      }
    },
    freezeTableName: true
  });

  return Activity;
};
