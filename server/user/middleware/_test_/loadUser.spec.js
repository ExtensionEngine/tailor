'use strict';

const chai = require('chai');
const sinon = require('sinon');
const loadUser = require('../loadUser');
const { locals } = require('../../../shared/io');

sinon.assert.expose(chai.assert, { prefix: '' });
const assert = chai.assert;

describe('User middleware', () => {
  function getMocks() {
    const req = {
      params: {
        userKey: 'some-user-key'
      }
    };
    const res = {};
    return { req, res };
  }

  describe('loadUser', () => {
    it('loads user by key, saves it to req, calls next', done => {
      const { req, res } = getMocks();
      const user = {
        email: 'user@email.com'
      };
      const model = {
        getByKey: sinon.stub().returns(Promise.resolve(user))
      };

      loadUser(model)(req, res, err => {
        assert.isUndefined(err);
        assert.deepEqual(locals.load(req, 'user'), user);
        done();
      });
    });

    it('calls next with error from user model', done => {
      const { req, res } = getMocks();
      const error = new Error('user model error');
      const model = {
        getByKey: sinon.stub().returns(Promise.reject(error))
      };

      loadUser(model)(req, res, err => {
        assert.deepEqual(err, error);
        done();
      });
    });
  });
});
