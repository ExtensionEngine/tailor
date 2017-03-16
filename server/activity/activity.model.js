'use strict';

const calculatePosition = require('../shared/util/calculatePosition');
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
      type: DataTypes.STRING
    },
    position: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: { min: 0 }
    },
    prerequisites: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
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
        Activity.hasMany(models.Tel);
        Activity.belongsTo(models.Course, {
          foreignKey: { name: 'courseId', field: 'course_id' }
        });
        Activity.belongsTo(Activity, {
          as: 'parent',
          foreignKey: { name: 'parentId', field: 'parent_id' }
        });
        Activity.hasMany(Activity, {
          as: 'children',
          foreignKey: { name: 'parentId', field: 'parent_id' }
        });
      }
    },
    instanceMethods: {
      siblings() {
        return Activity.findAll({
          where: {
            $and: [{ parentId: this.parentId }, { courseId: this.courseId }]
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
            this.position = calculatePosition(this.id, index, siblings);
            return this.save({ transaction: t });
          });
        });
      }
    },
    underscored: true,
    timestamps: true,
    paranoid: true,
    freezeTableName: true
  });

  return Activity;
};
