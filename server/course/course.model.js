'use strict';

const Joi = require('joi');
const isArray = require('lodash/isArray');
const isEmpty = require('lodash/isEmpty');
const BaseModel = require('../base.model');
const database = require('../shared/database');

const db = database.db;
const COURSE_COLLECTION = database.collection.COURSE;
const USER_COLLECTION = database.collection.USER;

/**
 * @swagger
 * definitions:
 *   CourseInput:
 *     type: object
 *     required:
 *     - name
 *       description
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
 *     - _key
 *       name
 *       description
 *     properties:
 *       _key:
 *         type: string
 *         description: unique course identifier
 *       name:
 *         type: string
 *         description: course title
 *       description:
 *         type: string
 *         description: short course description
 */
const courseSchema = Joi.object().keys({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(3).max(2000).required()
});

class CourseModel extends BaseModel {
  constructor(db,
    courseCollectionName = COURSE_COLLECTION,
    userCollectionName = USER_COLLECTION,
    schema = courseSchema
  ) {
    super(db, courseCollectionName, schema);
    this.userCollectionName = userCollectionName;
  }

  /**
   * getSearchFilter - Get filter string and bind variables for search filter,
   * if they are provided. Otherwise return empty values.
   *
   * @param  {string} search Search search
   * @return {array} Array containing filter string and bind variables object
   */
  static getCourseNameFilter(courseName) {
    const filter = 'CONTAINS(LOWER(course.name), LOWER(@courseName))';
    const bindVars = { courseName };
    return courseName ? [filter, bindVars] : [null, {}];
  }

  /**
   * getCourseKeysFilter - Get filter string and bind variables for
   * course keys, if they are provided. Otherwise return empty values.
   *
   * @param  {array} courseKeys Course key array
   * @return {array} Array containing filter string and bind variables object
   */
  static getCourseKeysFilter(courseKeys) {
    const filter = 'course._key IN @courseKeys';
    const bindVars = { courseKeys };
    return isArray(courseKeys) ? [filter, bindVars] : [null, {}];
  }

  /**
   * getPaginationBindVars- Get bind variables for page
   * and item count.
   *
   * @param {object} pagination Object containing page and item limit
   * @return {object} Object containing bind variables object
   */
  static getPaginationBindVars(pagination) {
    const { limit, page } = pagination;
    return {
      offset: (page * limit) - limit,
      count: limit
    };
  }

  /**
   * getFiltered - Filter courses by course keys and search if they are
   * passed. Otherwise, return all courses.
   *
   * @param  {array} courseKeys Course key array
   * @param  {string} courseName Course name to search by
   * @return {Promise<array>} Array of courses
   */
  getFiltered(filter, pagination, sort) {
    const [srFilter, srBindVars] = CourseModel.getCourseNameFilter(filter.courseName);
    const [ckFilter, ckBindVars] = CourseModel.getCourseKeysFilter(filter.courseKeys);
    const pgBindVars = CourseModel.getPaginationBindVars(pagination);
    const stBindVars = { field: sort.sortBy, order: sort.sortOrder };

    const combinedFilters = [srFilter, ckFilter].filter(f => f).join(' && ');
    const filterQuery = !isEmpty(combinedFilters) ? `FILTER ${combinedFilters}` : '';

    const bindVars = Object.assign({},
      srBindVars, ckBindVars, pgBindVars, stBindVars, {
        '@courseCollection': this.collectionName
      });

    const query = `
      FOR course IN @@courseCollection
        ${filterQuery}
        SORT course.@field @order
        LIMIT @offset, @count
      RETURN course`;

    return this.db
      .query(query, bindVars)
      .then(cursor => cursor.all());
  }

  /**
   * getEmailFilter - description
   *
   * @param {string} email Description
   * @return {array} Description
   */
  static getEmailFilter(email) {
    if (!email) return ['', {}];
    return ['FILTER CONTAINS(LOWER(user.email), LOWER(@email))', { email }];
  }

  /**
   * getUsers - description
   *
   * @param {object} filter Description
   * @return {Promise<array>} Description
   */
  getUsers(filter) {
    const { courseKey, email, roles } = filter;
    const [emailFilter, emailBindVars] = CourseModel.getEmailFilter(email);

    const query = `
      FOR user IN @@collection
        FILTER POSITION(user.courses, @courseKey)
        FILTER POSITION(@roles, user.role)
        ${emailFilter}
      RETURN UNSET(user, 'password')`;
    const bindVars = Object.assign({
      '@collection': this.userCollectionName,
      courseKey,
      roles
    }, emailBindVars);

    return this.db
      .query(query, bindVars)
      .then(cursor => cursor.all());
  }
}

module.exports = {
  schema: courseSchema,
  Model: CourseModel,
  model: new CourseModel(db)
};
