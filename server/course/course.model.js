const hooks = require('./hooks');

module.exports = function (sequelize, DataTypes) {
  const Course = sequelize.define('course', {
    schema: {
      type: DataTypes.STRING,
      validate: { notEmpty: true, len: [2, 20] }
    },
    name: {
      type: DataTypes.STRING,
      validate: { notEmpty: true, len: [2, 250] }
    },
    description: {
      type: DataTypes.TEXT,
      validate: { notEmpty: true, len: [2, 2000] }
    },
    data: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    stats: {
      type: DataTypes.JSON,
      defaultValue: { objectives: 0, assessments: 0 }
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
      addHooks(models) {
        hooks.add(Course, models);
      },
      updateStats(id, key, value) {
        return Course.findById(id)
          .then(course => {
            const stats = course.stats || {};
            stats[key] = value;
            return course.update({ stats });
          });
      }
    },
    instanceMethods: {
      getUser(user) {
        return this.getUsers({ where: { id: user.id } })
          .then(users => users[0]);
      },
      getInventoryItems() {
        const where = { detached: false };
        return Promise.all([
          this.getActivities({ where }),
          this.getTeachingElements({ where, order: [['activityId', 'ASC']] })
        ])
        .then(([activities, tes]) => ({ activities, tes }));
      }
    },
    underscored: true,
    timestamps: true,
    paranoid: true,
    freezeTableName: true
  });

  return Course;
};
