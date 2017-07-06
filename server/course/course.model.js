const Sequelize = require('sequelize');
const OUTLINE_LEVELS = require('../../config/shared/activities').OUTLINE_LEVELS;

/**
 * @swagger
 * definitions:
 *   CourseInput:
 *     type: object
 *     required:
 *     - name
 *     - description
 *     properties:
 *       name:
 *         type: string
 *         description: course title
 *       description:
 *         type: string
 *         description: short course description
 *   CourseOutput:
 *     type: object
 *     required:
 *     - id
 *     - name
 *     - description
 *     - users
 *     properties:
 *       id:
 *         type: number
 *         description: unique course identifier
 *       name:
 *         type: string
 *         description: course title
 *       description:
 *         type: string
 *         description: short course description
 *       users:
 *         type: array
 *         description: user course roles
 */
module.exports = function (sequelize, DataTypes) {
  const Course = sequelize.define('course', {
    name: {
      type: DataTypes.STRING,
      validate: { notEmpty: true, len: [2, 250] }
    },
    description: {
      type: DataTypes.TEXT,
      validate: { notEmpty: true, len: [2, 2000] }
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
    stats: Sequelize.VIRTUAL
  }, {
    classMethods: {
      associate(models) {
        Course.hasMany(models.Activity, {
          foreignKey: { name: 'courseId', field: 'course_id' }
        });
        Course.hasMany(models.TeachingElement, {
          foreignKey: { name: 'courseId', field: 'course_id' }
        });
        Course.belongsToMany(models.User, {
          through: models.CourseUser,
          foreignKey: { name: 'courseId', field: 'course_id' }
        });
      },
      getStats(courseIds) {
        const lastLevel = OUTLINE_LEVELS[OUTLINE_LEVELS.length - 1];

        const Activity = sequelize.models.activity;
        const TeachingElement = sequelize.models.TeachingElement;

        const count = col => sequelize.fn('count', sequelize.col(col));

        const leafs = Activity.findAll({
          attributes: [ 'courseId', [count('id'), /* as */ 'count'] ],
          group: ['courseId'],
          where: { courseId: /* in */ courseIds, type: lastLevel.type }
        });

        const assessments = TeachingElement.findAll({
          attributes: [ 'courseId', [count('id'), /* as */ 'count'] ],
          group: ['courseId'],
          where: { courseId: /* in */ courseIds, type: 'ASSESSMENT' }
        });

        return Promise.all([leafs, assessments])
          .then(([ leafs, assessments ]) => {
            let stats = {};
            leafs.forEach(({ dataValues }) => {
              stats[dataValues.courseId] = { leafs: dataValues.count, assessments: 0 };
            });

            assessments.forEach(({ dataValues }) => {
              let leafs = 0;
              if (stats[dataValues.courseId]) leafs = stats[dataValues.courseId].leafs;
              stats[dataValues.courseId] = { assessments: dataValues.count, leafs };
            });

            return stats;
          });
      }
    },
    instanceMethods: {
      getUser(user) {
        return this.getUsers({ where: { id: user.id } })
          .then(users => users[0]);
      }
    },
    underscored: true,
    timestamps: true,
    paranoid: true,
    freezeTableName: true
  });

  return Course;
};
