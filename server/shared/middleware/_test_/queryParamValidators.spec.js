'use strict';

const chai = require('chai');
const validators = require('../../middleware/queryParamValidators');
const config = require('../../../../config/server');

const assert = chai.assert;

describe('Query parameter validators', () => {
  describe('validatePage', () => {
    before(() => {
      this.validate = validators.validatePage;
      this.defaultPage = config.queryParams.pagination.page;
    });
    it('validates positive integer number', () => {
      const page = this.validate(6);
      assert.equal(page, 6);
      assert.typeOf(page, 'number');
    });
    it('returns default page for string', () => {
      assert.equal(this.validate('random string'), this.defaultPage);
    });
    it('returns default page for null', () => {
      assert.equal(this.validate(null), this.defaultPage);
    });
    it('returns default page for floating numbers', () => {
      assert.equal(this.validate(5.6), this.defaultPage);
    });
    it('returns default page for negative numbers', () => {
      assert.equal(this.validate(-8), this.defaultPage);
    });
    it('returns default page for zero', () => {
      assert.equal(this.validate(0), this.defaultPage);
    });
  });

  describe('validateLimit', () => {
    before(() => {
      this.validate = validators.validateLimit;
      this.defaultLimit = config.queryParams.pagination.limit;
    });
    it('validates positive integer greater than zero, lower than default limit', () => {
      const limit = this.validate(6);
      assert.equal(limit, 6);
      assert.typeOf(limit, 'number');
    });
    it('validates positive integer equal to default limit', () => {
      const limit = this.validate(this.defaultLimit);
      assert.equal(limit, this.defaultLimit);
      assert.typeOf(limit, 'number');
    });
    it('returns default limit for values greater than default limit', () => {
      assert.equal(this.validate(this.defaultLimit + 1), this.defaultLimit);
    });
    it('returns default limit for string', () => {
      assert.equal(this.validate('random string'), this.defaultLimit);
    });
    it('returns default limit for null', () => {
      assert.equal(this.validate(null), this.defaultLimit);
    });
    it('returns default limit for floating numbers', () => {
      assert.equal(this.validate(5.6), this.defaultLimit);
    });
    it('returns default limit for negative numbers', () => {
      assert.equal(this.validate(-4), this.defaultLimit);
    });
    it('returns default limit for zero', () => {
      assert.equal(this.validate(0), this.defaultLimit);
    });
  });

  describe('validateSortOrder', () => {
    before(() => {
      this.validate = validators.validateSortOrder;
      this.order = config.queryParams.sort.order;
    });
    it('validates ascending order', () => {
      const order = this.validate(this.order.ASC);
      assert.equal(order, this.order.ASC);
      assert.typeOf(order, 'string');
    });
    it('validates descending order', () => {
      const order = this.validate(this.order.DESC);
      assert.equal(order, this.order.DESC);
      assert.typeOf(order, 'string');
    });
    it('passing random string defaults to descending order', () => {
      assert.equal(this.validate('random'), this.order.DESC);
    });
    it('passing null defaults to descending order', () => {
      assert.equal(this.validate(null), this.order.DESC);
    });
    it('passing number defaults to descending order', () => {
      assert.equal(this.validate(33), this.order.DESC);
    });
  });

  describe('validateSortBy', () => {
    before(() => {
      this.validate = validators.validateSortBy;
      this.defaultField = config.queryParams.sort.field;
    });
    it('validates non-empty field string', () => {
      const field = this.validate('title');
      assert.equal(field, 'title');
      assert.typeOf(field, 'string');
    });
    it('return default field for empty string', () => {
      assert.equal(this.validate(''), this.defaultField);
    });
    it('returns default field for null', () => {
      assert.equal(this.validate(null), this.defaultField);
    });
    it('returns default field for number', () => {
      assert.equal(this.validate(4), this.defaultField);
    });
  });

  describe('validateQuery', () => {
    before(() => {
      this.validate = validators.validateQuery;
    });
    it('validates non-empty query string', () => {
      const query = this.validate('query string');
      assert.equal(query, 'query string');
      assert.typeOf(query, 'string');
    });
    it('returns null for empty string', () => {
      assert.isNull(this.validate(''));
    });
    it('returns null for null', () => {
      assert.isNull(this.validate(null));
    });
    it('returns null for number', () => {
      assert.isNull(this.validate(4));
    });
  });
});
