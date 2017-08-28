'use strict';

const calculatePosition = require('../shared/util/calculatePosition');
const isEmpty = require('lodash/isEmpty');
const map = require('lodash/map');
const pick = require('lodash/pick');
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
    data: {
      type: DataTypes.JSON
    },
    refs: {
      type: DataTypes.JSON
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
    },
    detached: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    classMethods: {
      associate(models) {
        Activity.hasMany(models.TeachingElement, {
          foreignKey: { name: 'activityId', field: 'activity_id' }
        });
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
      descendants(options = {}, nodes = [], leaves = []) {
        const { attributes = [] } = options;
        const node = !isEmpty(attributes) ? pick(this, attributes) : this;
        nodes.push(node);
        return Promise.resolve(this.getChildren({ attributes }))
          .map(it => it.descendants(options, nodes, leaves))
          .then(children => {
            if (!isEmpty(children)) return { nodes, leaves };
            const leaf = !isEmpty(attributes) ? pick(this, attributes) : this;
            leaves.push(leaf);
            return { nodes, leaves };
          });
      },
      remove(options = {}) {
        if (!options.recursive) return this.destroy(options);
        return sequelize.transaction(t => {
          return this.descendants({ attributes: ['id'] })
            .then(descendants => {
              descendants.all = [...descendants.nodes, ...descendants.leaves];
              return descendants;
            })
            .then(descendants => {
              const TeachingElement = sequelize.model('TeachingElement');
              const activities = map(descendants.all, 'id');
              const where = { activityId: [...activities, this.id] };
              return removeAll(TeachingElement, where, options.soft)
                .then(() => descendants);
            })
            .then(descendants => {
              const activities = map(descendants.nodes, 'id');
              const where = { parentId: [...activities, this.id] };
              return removeAll(Activity, where, options.soft);
            })
            .then(() => this.destroy(options))
            .then(() => this);
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
    underscored: true,
    timestamps: true,
    paranoid: true,
    freezeTableName: true
  });

  return Activity;
};

function removeAll(Model, where = {}, soft = false) {
  if (!soft) return Model.destroy({ where });
  return Model.update({ detached: true }, { where });
}
