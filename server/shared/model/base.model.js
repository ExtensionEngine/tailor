'use strict';

const Joi = require('joi');
const get = require('lodash/get');
const isArray = require('lodash/isArray');
const isEmpty = require('lodash/isEmpty');
const pickBy = require('lodash/pickBy');
const omitBy = require('lodash/omitBy');

class BaseModel {
  constructor(db, collectionName, schema = Joi.any()) {
    this.db = db;
    this.schema = schema;
    this.collectionName = collectionName;
    this.collection = db.collection(collectionName);
    this.searchTerms = {};

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
    this.getFiltered = this.getFiltered.bind(this);
    this.parseSearchTerms = this.parseSearchTerms.bind(this);
  }

  validate(document) {
    return new Promise((resolve, reject) => {
      Joi.validate(document, this.schema, (err, value) => {
        return err ? reject(err) : resolve(value);
      });
    });
  }

  validatePartial(partialDocument, omitFields = []) {
    const allKeys = get(this.schema, '_inner.children', []).map(c => c.key);
    const partialSchema = this.schema
      .optionalKeys(allKeys)
      .min(1);

    return new Promise((resolve, reject) => {
      Joi.validate(partialDocument, partialSchema, (err, value) => {
        // Only update fields received from client.
        // Ommit Joi default fields.
        let newValue = pickBy(value, (_, k) =>
          Object.keys(partialDocument).includes(k));

        if (isArray(omitFields) && !isEmpty(omitFields)) {
          newValue = omitBy(newValue, (_, k) => omitFields.includes(k));
        }

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

  getMany() {
    return this.collection.all().then(cursor => cursor.all());
  }

  getFiltered(search, pagination, sort) {
    const { page, limit } = pagination;
    const { sortBy, sortOrder } = sort;
    const { filter, vars } = this.parseSearchTerms(search);

    const bindVars = Object.assign(vars, {
      prop: sortBy,
      order: sortOrder,
      offset: (page * limit) - limit,
      count: limit,
      '@collection': this.collectionName
    });
    const query = `
      FOR doc IN @@collection
        ${filter}
        SORT doc.@prop @order
        LIMIT @offset, @count
      RETURN doc`;

    return this.db
      .query(query, bindVars)
      .then(cursor => cursor.all());
  }

  parseSearchTerms(search) {
    let bindVars = {};
    const filters = [];
    const supportedTerms = Object.keys(this.searchTerms);

    Object.keys(search).forEach(searchTerm => {
      if (supportedTerms.includes(searchTerm)) {
        const searchValue = search[searchTerm];
        const parseFn = this.searchTerms[searchTerm];
        const { filter, vars } = parseFn(searchValue);
        filters.push(filter);
        bindVars = Object.assign(bindVars, vars);
      }
    });

    return { filter: filters.join('\n'), vars: bindVars };
  }
}

module.exports = BaseModel;
