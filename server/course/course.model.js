'use strict';

const { getRepositoryRelationships, getSchema } = require('../../config/shared/activities');
const { Model } = require('sequelize');
const pick = require('lodash/pick');
const Promise = require('bluebird');

class Course extends Model {
  static fields(DataTypes) {
    const { DATE, JSONB, STRING, TEXT, UUID, UUIDV4, VIRTUAL } = DataTypes;
    return {
      uid: {
        type: UUID,
        unique: true,
        defaultValue: UUIDV4
      },
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
        type: JSONB,
        defaultValue: {}
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
      },
      isLinkingEnabled: {
        type: VIRTUAL,
        get() {
          return this.getSchemaConfig().linkingEnabled;
        }
      }
    };
  }

  static associate({ Activity, Comment, CourseUser, Revision, TeachingElement, User }) {
    this.hasMany(Activity, {
      foreignKey: { name: 'courseId', field: 'course_id' }
    });
    this.hasMany(Comment, {
      foreignKey: { name: 'courseId', field: 'course_id' }
    });
    this.hasMany(TeachingElement, {
      foreignKey: { name: 'courseId', field: 'course_id' }
    });
    this.hasMany(Revision, {
      foreignKey: { name: 'courseId', field: 'course_id' }
    });
    this.hasMany(CourseUser, {
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

  /**
   * Maps references for cloned activities and teaching elements.
   * @param {Object} mappings Dict where keys represent old and values new ids.
   * @param {SequelizeTransaction} [transaction]
   * @returns {Promise.<Object>} Object with mapped activities and elements.
   */
  async mapClonedReferences(mappings, transaction) {
    const Activity = this.sequelize.model('Activity');
    const TeachingElement = this.sequelize.model('TeachingElement');
    const opts = { where: { courseId: this.id }, transaction };
    const relationships = getRepositoryRelationships(this.schema);
    const [activities, elements] = await Promise.all([
      Activity.scope({ method: ['withReferences', relationships] }).findAll(opts),
      TeachingElement.scope('withReferences').findAll(opts)
    ]);
    return Promise.join(
      Promise.map(activities, it => it.mapClonedReferences(mappings, relationships, transaction)),
      Promise.map(elements, it => it.mapClonedReferences(mappings, transaction)),
      (activities, elements) => ({ activities, elements })
    );
  }

  clone(name, description, context) {
    const Course = this.sequelize.model('Course');
    const Activity = this.sequelize.model('Activity');
    const courseAttributes = {
      ...pick(this, ['schema', 'data', 'stats']),
      name,
      description
    };
    return this.sequelize.transaction(async transaction => {
      const course = await Course.create(courseAttributes, { context, transaction });
      const where = { courseId: this.id, parentId: null };
      const src = await Activity.findAll({ where, transaction });
      const { isLinkingEnabled, id } = course;
      let options = {
        courseId: id,
        transaction,
        isLinkingEnabled,
        shouldCloneOrigins: true
      };
      let idMap = await Activity.cloneActivities(src, options);
      await course.mapClonedReferences(idMap, transaction);
      return course;
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

  getSchemaConfig() {
    return getSchema(this.schema);
  }
}

module.exports = Course;
