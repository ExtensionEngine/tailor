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
    }
  }, {
    classMethods: {
      associate(models) {
        Course.belongsToMany(models.User, { through: models.CourseUser });
        Course.hasMany(models.Activity);
        Course.hasMany(models.Asset);
      },
      track(models) {
        const Revision = models.Revision;
        Course.hook('afterCreate', (course, { context }) => {
          if (context && context.userId) {
            Revision.create({
              userId: context.userId,
              courseId: course.id,
              entity: 'COURSE',
              operation: 'CREATE',
              state: course.get({ plain: true })
            });
          }
        });

        Course.hook('afterUpdate', (course, { context }) => {
          if (context && context.userId) {
            Revision.create({
              userId: context.userId,
              courseId: course.id,
              entity: 'COURSE',
              operation: 'UPDATE',
              state: course.get({ plain: true })
            });
          }
        });

        Course.hook('afterDestroy', (course, { context }) => {
          if (context && context.userId) {
            // This won't work because course.id is no longer a valid foreign
            // key. Uncomment if/when courses are soft-deleted.

            // Revision.create({
            //   userId: context.userId,
            //   courseId: course.id,
            //   entity: 'COURSE',
            //   operation: 'REMOVE',
            //   state: course.get({ plain: true })
            // });
          }
        });
      }
    },
    instanceMethods: {
      getUser(user) {
        return this.getUsers({ where: { id: user.id } })
          .then(users => users[0]);
      }
    },
    freezeTableName: true
  });

  return Course;
};
