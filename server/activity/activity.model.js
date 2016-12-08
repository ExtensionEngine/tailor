'use strict';

const Joi = require('joi');
const BaseModel = require('../base.model');
const database = require('../shared/database');
const db = database.db;
const ACTIVITY_COLLECTION = database.collection.ACTIVITY;

const activitySchema = Joi.object().keys({
  name: Joi.string().min(3).max(100).required(),
  type: Joi.string(), // TODO(matej): type should be one of predefined types
  courseKey: Joi.string().regex(/[0-9]+/).required(),
  parentKey: Joi.string().allow(null).regex(/[0-9]+/).required(),
  position: Joi.number().integer()
});

class ActivityModel extends BaseModel {
  constructor(db, collectionName = ACTIVITY_COLLECTION, schema = activitySchema) {
    super(db, collectionName, schema);
  }

  create(activity) {
    const action = function({ doc }) {
      const arango = require('@arangodb');
      const db = arango.db;
      const aql = arango.aql;

      if (doc.parentKey && !db.activity.exists(doc.parentKey)) {
        throw new Error(
          `Parent activity (${doc.parentKey}) does not exist`);
      }

      const countSiblings = aql`RETURN LENGTH(FOR act IN activity
        FILTER act.courseKey == ${doc.courseKey} AND
          act.parentKey == ${doc.parentKey}
        RETURN act)`;
      const numSiblings = db._query(countSiblings).next();

      if (doc.position === undefined ||
          doc.position === null ||
          doc.position >= numSiblings) {
        doc.position = numSiblings;
        // This does not return the entire object!
        return db.activity.save(doc);
      }

      if (doc.position < 0) doc.position = 0;

      const updateExisting = aql`FOR act IN activity
        FILTER act.courseKey == ${doc.courseKey} AND
          act.parentKey == ${doc.parentKey} AND
          act.position >= ${doc.position}
        UPDATE act WITH { position: act.position + 1 } IN activity`;
      db._query(updateExisting);
      return db.activity.save(doc);
    };

    return this
      .validate(activity)
      .then(validActivity => this.db.transaction(
        { read: 'activity', write: 'activity' },
        String(action),
        { doc: activity }));
  }
}

module.exports = {
  schema: activitySchema,
  Model: ActivityModel,
  model: new ActivityModel(db)
};
