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

  // getByKeys(courseKeys) {
  //   const query = `
  //     FOR course IN @@courseCollection
  //       FILTER course._key IN @courseKeys
  //       RETURN course`;
  //   const bindVars = {
  //     '@courseCollection': this.collectionName,
  //     courseKeys
  //   };
  //
  //   return this.db
  //     .query(query, bindVars)
  //     .then(cursor => cursor.all());
  // }

  /**
   * getSearchFilter - Get filter string and bind variables for search filter,
   * if they are provided. Otherwise return empty values.
   *
   * @param  {string} search Search search
   * @return {array} Array containing filter string and bind variables object
   */
  getSearchFilter(search) {
    const filter = 'FILTER CONTAINS(LOWER(course.name), LOWER(@search))';
    const bindVars = { search };
    return search ? [filter, bindVars] : [null, {}];
  }

  /**
   * getCourseKeysFilter - Get filter string and bind variables for course keys,
   * if they are provided. Otherwise return empty values.
   *
   * @param  {array} courseKeys Course key array
   * @return {array} Array containing filter string and bind variables object
   */
  getCourseKeysFilter(courseKeys) {
    const filter = 'FILTER course._key IN @courseKeys';
    const bindVars = { courseKeys };
    return courseKeys ? [filter, bindVars] : [null, {}];
  }

  /**
   * getFiltered - Filter courses by course keys and search if they are
   * passed. Otherwise, return all courses.
   *
   * @param  {array} courseKeys Course key array
   * @param  {string} search Search search
   * @return {function}
   */
  getFiltered(courseKeys, search) {
    const [srFilter, srBindVars] = this.getSearchFilter(search);
    const [ckFilter, ckBindVars] = this.getCourseKeysFilter(courseKeys);

    const filters = [srFilter, ckFilter].filter(f => f).join(' && ');
    const bindVars = Object.assign({}, srBindVars, ckBindVars, {
      '@courseCollection': this.collectionName
    });

    const query = `
      FOR course IN @@courseCollection
        ${filters}
      RETURN course`;

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
