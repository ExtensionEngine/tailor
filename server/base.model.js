'use strict';

const Joi = require('joi');

class BaseModel {
  constructor(db, collectionName, schema = Joi.any()) {
    this.db = db;
    this.schema = schema;
    this.collectionName = collectionName;
    this.collection = db.collection(collectionName);

    this.validate = this.validate.bind(this);
    this.markAsCreated = this.markAsCreated.bind(this);
    this.markAsModified = this.markAsModified.bind(this);
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

  markAsCreated(document) {
    document.createdAt = new Date().toISOString();
    document.modifiedAt = new Date().toISOString();
    return document;
  }

  markAsModified(document) {
    document.modifiedAt = new Date().toISOString();
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

  // This method allows inserting arbitrary documents. TODO(matej): fix this
  // by validating with Joi or removing all keys not present in the schema.
  updateByKey(key, partialDocument) {
    delete partialDocument.createdAt;
    delete partialDocument.modifiedAt;
    const doc = this.markAsModified(partialDocument);
    return this.collection
      .update({ _key: key }, doc, { returnNew: true })
      .then(result => result.new);
  }

  replaceByKey(key, newDocument) {
    return this
      .validate(newDocument)
      .then(this.markAsModified)
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
