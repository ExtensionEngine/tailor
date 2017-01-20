'use strict';

const Joi = require('joi');
const database = require('../shared/database');
const BaseModel = require('../base.model');
const action = require('./action');

const db = database.db;
const ACTIVITY_COLLECTION = database.collection.ACTIVITY;

/**
 * @swagger
 * definitions:
 *   ActivityInput:
 *     type: object
 *     required:
 *     - name
 *     properties:
 *       name:
 *         type: string
 *         description: activity title
 *       parentKey:
 *         type: string
 *         description: key to the parent activity, or null for root activities
 *       position:
 *         type: integer
 *         description: position within the array of sibling activities. If not
 *                      set, the server will auto-generate correct position.
 *   ActivityReorderInput:
 *     type: object
 *     required:
 *     - position
 *     properties:
 *       position:
 *         type: integer
 *         description: non-negative integer representing the new position
 *   ActivityOutput:
 *     type: object
 *     required:
 *     - _key
 *     - courseKey
 *     - parentKey
 *     - name
 *     - position
 *     properties:
 *       _key:
 *         type: string
 *         description: unique activity identifier
 *       courseKey:
 *         type: string
 *         description: id of the course containing this activity
 *       parentKey:
 *         type: string
 *         description: key to the parent activity, or null for root activities
 *       name:
 *         type: string
 *         description: activity title
 *       position:
 *         type: integer
 *         description: position within the array of sibling activities
 */
const schemaKeys = {
  name: Joi.string().min(3).max(100).required(),
  type: Joi.string(), // TODO(matej): type should be one of predefined types
  courseKey: Joi.string().regex(/^\d+$/).required(),
  parentKey: Joi.string().allow(null).regex(/^\d+$/).required(),
  position: Joi.number().integer().min(0)
};
const activitySchema = Joi.object().keys(schemaKeys);
const positionSchema = Joi.object().keys({
  position: schemaKeys.position.required()
});
const updateSchema = Joi.object().keys({
  name: schemaKeys.name.required()
});

class ActivityModel extends BaseModel {
  constructor(db, collectionName = ACTIVITY_COLLECTION, schema = activitySchema) {
    super(db, collectionName, schema);
  }

  validatePartial(partialDocument) {
    return new Promise((resolve, reject) => {
      Joi.validate(partialDocument, updateSchema, (err, value) => {
        return err ? reject(err) : resolve(value);
      });
    });
  }

  execAction(action, params) {
    const locks = {
      read: ACTIVITY_COLLECTION,
      write: ACTIVITY_COLLECTION
    };
    return this.db.transaction(locks, String(action), params);
  }

  create(activity) {
    return this
      .validate(activity)
      .then(this.markAsCreated)
      .then(validActivity => this.execAction(action.insert, {
        newActivity: validActivity,
        activityCollection: ACTIVITY_COLLECTION
      }));
  }

  getByKey(courseKey, activityKey) {
    const query = `
      FOR activity IN @@activityCollection
        FILTER activity.courseKey == @courseKey AND
               activity._key == @activityKey
        RETURN activity`;
    const bindVars = {
      courseKey,
      activityKey,
      '@activityCollection': ACTIVITY_COLLECTION
    };

    return this.db
      .query(query, bindVars)
      .then(cursor => cursor.next());
  }

  getMany(courseKey) {
    const query = `
      FOR activity IN @@activityCollection
        FILTER activity.courseKey == @courseKey
        RETURN activity`;
    const bindVars = {
      courseKey,
      '@activityCollection': ACTIVITY_COLLECTION
    };

    return this.db
      .query(query, bindVars)
      .then(cursor => cursor.all());
  }

  removeByKey(courseKey, activityKey) {
    return this.execAction(action.remove, {
      courseKey,
      activityKey,
      activityCollection: ACTIVITY_COLLECTION
    });
  }

  reorder(courseKey, activityKey, newPosition) {
    const { error, value } = Joi.validate({ position: newPosition }, positionSchema);
    if (error) return Promise.reject(error);
    return this.execAction(action.reorder, {
      courseKey,
      activityKey,
      requestedPosition: value.position,
      activityCollection: ACTIVITY_COLLECTION
    });
  }
}

module.exports = {
  schema: activitySchema,
  Model: ActivityModel,
  model: new ActivityModel(db)
};
