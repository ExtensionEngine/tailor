'use strict';
const Joi = require('joi');
const db = require('../database').db;

const courseSchema = Joi.object().keys({
  name: Joi.string().min(3).max(100).required()
});

const COLLECTION_NAME = 'course';

function validate(data, schema) {
  return new Promise((resolve, reject) => {
    Joi.validate(data, schema, (err, value) => err ? reject(err) : resolve(value));
  });
};

class CourseModel {
  constructor(db, collectionName, schema) {
    this.db = db;
    this.collectionName = collectionName;
    this.schema = schema;
    this.collection = db.collection(collectionName);
  }

  create(document) {
    return validate(document, this.schema)
      .then(validDocument => this.db.query(
        'INSERT @validDocument IN @@collection RETURN NEW', {
          '@collection': this.collectionName,
          validDocument
        }))
      .then(cursor => cursor.next());
  }

  get(key) {
    return this.collection.document({ _key: key });
  }

  getAll() {
    return this.collection.all().then(cursor => cursor.all());
  }

  update(key, partialDocument) {
    return this.collection
      .update({ _key: key }, partialDocument, { returnNew: true })
      .then(result => result.new);
  }

  replace(key, newDocument) {
    return validate(newDocument, this.schema)
      .then(validDocument => this.collection.replace(
        { _key: key },
        validDocument,
        { returnNew: true }
      ))
      .then(result => result.new);
  }

  remove(key) {
    return this.collection
      .remove({ _key: key }, { returnOld: true })
      .then(result => result.old);
  }
}

module.exports = {
  COLLECTION_NAME,
  schema: courseSchema,
  Model: CourseModel,
  model: new CourseModel(db, COLLECTION_NAME, courseSchema)
};
