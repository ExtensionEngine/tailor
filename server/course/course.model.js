'use strict';

const Joi = require('joi');
const BaseModel = require('../base.model');
const db = require('../shared/database').db;
const collection = require('../shared/database').collection;

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
  constructor(db, collectionName = collection.COURSE, schema = courseSchema) {
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
