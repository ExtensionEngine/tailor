'use strict';

const Joi = require('joi');
const BaseModel = require('../base.model');
const db = require('../shared/database').db;

const activitySchema = Joi.object().keys({
  name: Joi.string().min(3).max(100).required(),
  type: Joi.string(), // TODO(matej): type should be one of predefined types
  courseKey: Joi.string().regex(/[0-9]+/).required(),
  parentKey: Joi.string().allow(null).regex(/[0-9]+/).required(),
  position: Joi.number().integer().min(0)
});

const COLLECTION_NAME = 'activity';

class ActivityModel extends BaseModel {
  constructor(db, collectionName = COLLECTION_NAME, schema = activitySchema) {
    super(db, collectionName, schema);
  }
}

module.exports = {
  COLLECTION_NAME,
  schema: activitySchema,
  Model: ActivityModel,
  model: new ActivityModel(db)
};
