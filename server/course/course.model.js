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
 *     properties:
 *       name:
 *         type: string
 *         description: course title
 *   CourseOutput:
 *     type: object
 *     required:
 *     - _key
 *     - name
 *     properties:
 *       _key:
 *         type: string
 *         description: unique course identifier
 *       name:
 *         type: string
 *         description: course title
 */
const courseSchema = Joi.object().keys({
  name: Joi.string().min(3).max(100).required()
});

class CourseModel extends BaseModel {
  constructor(db, collectionName = COURSE_COLLECTION, schema = courseSchema) {
    super(db, collectionName, schema);
  }

  getByKeys(courseKeys) {
    const query = `
      FOR course IN @@courseCollection
        FILTER course._key IN @courseKeys
        RETURN course`;
    const bindVars = {
      '@courseCollection': this.collectionName,
      courseKeys
    };

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
