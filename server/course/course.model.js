'use strict';

const Joi = require('joi');
const BaseModel = require('../base.model');
const db = require('../database').db;

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

const COLLECTION_NAME = 'course';

class CourseModel extends BaseModel {
  constructor(db, collectionName = COLLECTION_NAME, schema = courseSchema) {
    super(db, collectionName, schema);
  }
}

module.exports = {
  COLLECTION_NAME,
  schema: courseSchema,
  Model: CourseModel,
  model: new CourseModel(db)
};
