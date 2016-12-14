'use strict';

const chai = require('chai');
const sinon = require('sinon');
const response = require('../response');

sinon.assert.expose(chai.assert, { prefix: '' });
const assert = chai.assert;

describe('Response utilities', () => {
  function getMocks() {
    const res = {
      originalUrl: 'http://api.whatever.com/v1/api/stuff',
      location: sinon.stub(),
      status: sinon.stub()
    };
    const data = {
      _key: 'key',
      x: 100,
      y: 200
    };
    return { res, data };
  }

  describe('setOK', () => {
    it('saves the data to response, sets status 200', () => {
      const { res, data } = getMocks();

      response.setOK(res, data);

      assert.calledOnce(res.status);
      assert.calledWithExactly(res.status, 200);
      assert.deepEqual(res.locals.io.data, data);
    });
  });

  describe('setCreated', () => {
    it('saves data to response, sets status 201, sets location header', () => {
      const { res, data } = getMocks();

      response.setCreated(res, data);

      assert.calledOnce(res.status);
      assert.calledWithExactly(res.status, 201);
      assert.calledOnce(res.location);
      assert.calledWithExactly(res.location, 'http://api.whatever.com/v1/api/stuff/key');
      assert.deepEqual(res.locals.io.data, data);
    });
  });

  describe('setCreated', () => {
    it('makes response data blank, sets status 204', () => {
      const { res } = getMocks();

      response.setEmpty(res);

      assert.calledOnce(res.status);
      assert.calledWithExactly(res.status, 204);
      assert.isUndefined(res.locals.io.data);
    });
  });

  describe('getData', () => {
    it('returns data prepared for serialization', () => {
      const { res, data } = getMocks();
      res.locals = { io: { data } };
      assert.deepEqual(response.getData(res), data);
    });
  });
});
