const _ = require('lodash');
const chai = require('chai');
const sinon = require('sinon');
const { input, output, setOK } = require('../index');

sinon.assert.expose(chai.assert, { prefix: '' });
const assert = chai.assert;

describe('IO middleware', () => {
  function getMocks() {
    const req = {
      originalUrl: 'http://api.whatever.com/v1/api/stuff'
    };
    const res = {
      json: sinon.spy(),
      status: sinon.spy()
    };
    const next = sinon.spy();
    return { req, res, next };
  }

  describe('input', () => {
    it('saves originalUrl to response, calls next', () => {
      const { req, res, next } = getMocks();

      input()(req, res, next);

      assert.calledOnce(next);
      assert.calledWithExactly(next);
      assert.equal(req.originalUrl, res.originalUrl);
    });
  });

  describe('output', () => {
    function getMockData() {
      const dataOut = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1 },
        { x: 2, y: 2, z: 2 }
      ];
      const dataIn = _.cloneDeep(dataOut);
      for (let i = 0; i < 3; i++) {
        dataIn[i]._id = i;
        dataIn[i]._rev = i;
        dataIn[i].password = `${i}`;
      }
      return { dataIn, dataOut };
    }

    it('uses default config, removes properties from array, sends response', () => {
      const { req, res, next } = getMocks();
      const { dataIn, dataOut } = getMockData();
      setOK(res, dataIn);

      output()(req, res, next);

      assert.notCalled(next);
      assert.calledWith(res.json, { data: dataOut });
    });

    it('uses default config, removes properties from single object, sends response', () => {
      const { req, res, next } = getMocks();
      const { dataIn, dataOut } = getMockData();
      setOK(res, dataIn[0]);

      output()(req, res, next);

      assert.notCalled(next);
      assert.calledWith(res.json, { data: dataOut[0] });
    });
  });
});
