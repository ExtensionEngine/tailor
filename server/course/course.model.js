const hooks = require('./hooks');
const { Model } = require('sequelize');

class Course extends Model {
  static fields(DataTypes) {
    const { DATE, JSON, STRING, TEXT } = DataTypes;
    return {
      schema: {
        type: STRING,
        validate: { notEmpty: true, len: [2, 20] }
      },
      name: {
        type: STRING,
        validate: { notEmpty: true, len: [2, 250] }
      },
      description: {
        type: TEXT,
        validate: { notEmpty: true, len: [2, 2000] }
      },
      data: {
        type: JSON,
        defaultValue: {}
      },
      stats: {
        type: JSON,
        defaultValue: { objectives: 0, assessments: 0 }
      },
      createdAt: {
        type: DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at'
      },
      deletedAt: {
        type: DATE,
        field: 'deleted_at'
      }
    };
  }

  static associate({ Activity, CourseUser, TeachingElement, User }) {
    this.hasMany(Activity, {
      foreignKey: { name: 'courseId', field: 'course_id' }
    });
    this.hasMany(TeachingElement, {
      foreignKey: { name: 'courseId', field: 'course_id' }
    });
    this.belongsToMany(User, {
      through: CourseUser,
      foreignKey: { name: 'courseId', field: 'course_id' }
    });
  }

  static options() {
    return {
      modelName: 'course',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  static addHooks(models) {
    hooks.add(this, models);
  }

  static updateStats(id, key, value) {
    return this.findById(id).then(course => {
      const stats = course.stats || {};
      stats[key] = value;
      return course.update({ stats });
    });
  }

  getUser(user) {
    return this.getUsers({ where: { id: user.id } })
      .then(users => users[0]);
  }

  getInventoryItems() {
    const where = { detached: false };
    return Promise.all([
      this.getActivities({ where }),
      this.getTeachingElements({ where, order: [['activityId', 'ASC']] })
    ])
    .then(([activities, tes]) => ({ activities, tes }));
  }
}

module.exports = Course;
