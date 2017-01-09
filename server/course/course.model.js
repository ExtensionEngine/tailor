'use strict';

const Joi = require('joi');
const BaseModel = require('../base.model');
const database = require('../shared/database');

const db = database.db;
const COURSE_COLLECTION = database.collection.COURSE;

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
  constructor(db, collectionName = COURSE_COLLECTION, schema = courseSchema) {
    super(db, collectionName, schema);
  }

  /**
   * getSearchFilter - Get filter string and bind variables for search filter,
   * if they are provided. Otherwise return empty values.
   *
   * @param  {string} search Search search
   * @return {array} Array containing filter string and bind variables object
   */
  static getCourseNameFilter(courseName) {
    const filter = 'FILTER CONTAINS(LOWER(course.name), LOWER(@courseName))';
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
    const filter = 'FILTER course._key IN @courseKeys';
    const bindVars = { courseKeys };
    return courseKeys ? [filter, bindVars] : [null, {}];
  }

  /**
   * getSortQuery - Get sort query and bind variables for sort field and
   * sort order.
   *
   * @param {object} sort Object containing sort order and field to sort by
   * @return {array} Array containing sort query string and bind
   * variables object
   */
  static getSortQuery(sort) {
    const { sortBy, sortOrder } = sort;
    const query = 'SORT course.@field @order';
    const bindVars = { field: sortBy, order: sortOrder };
    return [query, bindVars];
  }

  /**
   * getPaginationQuery - Get pagination query and bind variables for page
   * and item limit.
   *
   * @param {object} pagination Object containing page and item limit
   * @return {array} Array containing pagination query string and bind
   * variables object
   */
  static getPaginationQuery(pagination) {
    const { limit, page } = pagination;
    const query = 'LIMIT @offset, @count';
    const bindVars = {
      offset: (page * limit) - limit,
      count: limit
    };
    return [query, bindVars];
  }

  /**
   * getPaginatedData - Wrap paginated data into a singe object.
   *
   * @param {object} data Query data - docs and total doc number
   * @param {object} pagination Pagination - page and limit number
   * @return {object} Total number of pages along with rest of
   * passed data.
   */
  static getPaginatedData(data, pagination) {
    const { docs, total } = data;
    const { page, limit } = pagination;

    return {
      docs,
      total,
      page,
      pages: Math.ceil(total / limit)
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
    const [paginationQuery, pgBindVars] = CourseModel.getPaginationQuery(pagination);
    const [sortQuery, stBindVars] = CourseModel.getSortQuery(sort);

    const filterQuery = [srFilter, ckFilter].filter(f => f).join(' && ');
    const bindVars = Object.assign({},
      srBindVars, ckBindVars, pgBindVars, stBindVars, {
        '@courseCollection': this.collectionName
      });

    const query = `
      LET docs = (
        FOR course IN @@courseCollection
          ${filterQuery}
          ${sortQuery}
          ${paginationQuery}
        RETURN course
      )
      RETURN {
        total: COUNT(@@courseCollection),
        docs: docs
      }`;

    return this.db
      .query(query, bindVars)
      .then(cursor =>
        cursor.all().then(
          results => CourseModel.getPaginatedData(results[0], pagination)
        )
      );
  }
}

module.exports = {
  schema: courseSchema,
  Model: CourseModel,
  model: new CourseModel(db)
};
