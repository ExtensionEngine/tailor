'use strict';
const Joi = require('joi');

class BaseModel {
  constructor(db, collectionName, schema = Joi.any()) {
    this.db = db;
    this.schema = schema;
    this.collectionName = collectionName;
    this.collection = db.collection(collectionName);
  }

  validate(document) {
    return new Promise((resolve, reject) => {
      Joi.validate(document, this.schema, (err, value) => {
        return err ? reject(err) : resolve(value);
      });
    });
  }

  create(document) {
    return this
      .validate(document)
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

  // TODO(matej): rename to getMany, expose offset and limit.
  getAll() {
    return this.collection.all().then(cursor => cursor.all());
  }

  // TODO(matej): can Joi be used to validate individual keys?
  update(key, partialDocument) {
    return this.collection
      .update({ _key: key }, partialDocument, { returnNew: true })
      .then(result => result.new);
  }

  replace(key, newDocument) {
    return this
      .validate(newDocument)
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

module.exports = BaseModel;
