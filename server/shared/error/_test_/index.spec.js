'use strict';

const chai = require('chai');
const sinon = require('sinon');

const logger = require('../../logger');
const genericErrorProcessor = require('../generic');
const errorHandler = require('../index').errorHandler;

sinon.assert.expose(chai.assert, { prefix: '' });
const assert = chai.assert;

describe('Error-handling middleware', () => {
  let mockLogger;

  function getMocks() {
    const req = null;
    const res = { json: sinon.spy() };
    const next = sinon.spy();
    res.status = sinon.stub().returns(res);
    return { req, res, next };
  }

  before(() => {
    mockLogger = sinon.mock(logger);
    // Number of expected calls ('exactly') should match the number of tests.
    mockLogger.expects('error').exactly(2);
  });

  after(() => {
    mockLogger.restore();
  });

  it('uses generic error processor when no processors are supplied',
    sinon.test(function() {
      const status = 123456;
      this.mock(genericErrorProcessor).expects('canProcessError').exactly(1).returns(true);
      this.mock(genericErrorProcessor).expects('processError').exactly(1).returns({ status });

      const { req, res, next } = getMocks();
      const err = new Error('some unexpected error');
      const handler = errorHandler([]);

      handler(err, req, res, next);

      assert.notCalled(next);
      assert.calledOnce(res.status);
      assert.calledWithExactly(res.status, status);
      assert.calledOnce(res.json);
    }));

  it('passes through the given list of processors until one responds', () => {
    const status = 123456;
    const proc0 = {
      canProcessError: sinon.stub().returns(false),
      processError: sinon.spy()
    };
    const proc1 = {
      canProcessError: sinon.stub().returns(true),
      processError: sinon.stub().returns({ status })
    };
    const proc2 = {
      canProcessError: sinon.spy(),
      processError: sinon.spy()
    };
    const { req, res, next } = getMocks();
    const err = new Error('some unexpected error');
    const handler = errorHandler([proc0, proc1, proc2]);

    handler(err, req, res, next);

    assert.calledOnce(proc0.canProcessError);
    assert.calledWithExactly(proc0.canProcessError, err);
    assert.notCalled(proc0.processError);
    assert.calledOnce(proc1.canProcessError);
    assert.calledWithExactly(proc1.canProcessError, err);
    assert.calledOnce(proc1.processError);
    assert.calledWithExactly(proc1.processError, err);
    assert.notCalled(proc2.canProcessError);
    assert.notCalled(proc2.processError);

    assert.notCalled(next);
    assert.calledOnce(res.status);
    assert.calledWithExactly(res.status, status);
    assert.calledOnce(res.json);
  });
});
