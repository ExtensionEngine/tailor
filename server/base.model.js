'use strict';

const Joi = require('joi');
const get = require('lodash/get');
const omitBy = require('lodash/omitBy');

class BaseModel {
  constructor(db, collectionName, schema = Joi.any()) {
    this.db = db;
    this.schema = schema;
    this.collectionName = collectionName;
    this.collection = db.collection(collectionName);

    this.validate = this.validate.bind(this);
    this.validatePartial = this.validatePartial.bind(this);
    this.markAsCreated = this.markAsCreated.bind(this);
    this.markAsUpdated = this.markAsUpdated.bind(this);
    this.create = this.create.bind(this);
    this.getByKey = this.getByKey.bind(this);
    this.updateByKey = this.updateByKey.bind(this);
    this.replaceByKey = this.replaceByKey.bind(this);
    this.removeByKey = this.removeByKey.bind(this);
    this.getMany = this.getMany.bind(this);
  }

  validate(document) {
    return new Promise((resolve, reject) => {
      Joi.validate(document, this.schema, (err, value) => {
        return err ? reject(err) : resolve(value);
      });
    });
  }

  validatePartial(partialDocument, atLeastOneKeyRequired = true) {
    const allKeys = get(this.schema, '_inner.children', []).map(c => c.key);
    const partialSchema = this.schema
      .optionalKeys(allKeys)
      .min(atLeastOneKeyRequired ? 1 : 0);

    return new Promise((resolve, reject) => {
      Joi.validate(partialDocument, partialSchema, (err, value) => {
        // Omit any default fields filled by Joi
        const newValue = omitBy(value, (_, k) =>
          Object.keys(partialDocument).indexOf(k) === -1
        );
        return err ? reject(err) : resolve(newValue);
      });
    });
  }

  markAsCreated(document) {
    const now = Date.now();
    document.createdAt = now;
    document.updatedAt = now;
    return document;
  }

  markAsUpdated(document) {
    document.updatedAt = Date.now();
    return document;
  }

  create(document) {
    return this
      .validate(document)
      .then(this.markAsCreated)
      .then(validDocument => this.db.query(
        'INSERT @validDocument IN @@collection RETURN NEW', {
          '@collection': this.collectionName,
          validDocument
        }))
      .then(cursor => cursor.next());
  }

  getByKey(key) {
    return this.collection.document({ _key: key });
  }

  updateByKey(key, partialDocument) {
    return this
      .validatePartial(partialDocument)
      .then(this.markAsUpdated)
      .then(validDocument => this.collection.update(
        { _key: key },
        validDocument,
        { returnNew: true }
      ))
      .then(result => result.new);
  }

  replaceByKey(key, newDocument) {
    return this
      .validate(newDocument)
      .then(this.markAsUpdated)
      .then(validDocument => this.collection.update(
        { _key: key },
        validDocument,
        { returnNew: true }
      ))
      .then(result => result.new);
  }

  removeByKey(key) {
    return this.collection
      .remove({ _key: key }, { returnOld: true })
      .then(result => result.old);
  }

  // TODO(matej): expose offset and limit.
  getMany() {
    return this.collection.all().then(cursor => cursor.all());
  }
}

module.exports = BaseModel;
