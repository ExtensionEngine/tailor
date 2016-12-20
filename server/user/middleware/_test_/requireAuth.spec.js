'use strict';

const chai = require('chai');
const sinon = require('sinon');
const {
  requireRole,
  requireUser
} = require('../requireAuth');

sinon.assert.expose(chai.assert, { prefix: '' });
const assert = chai.assert;

describe('User middleware', () => {
  function getMocks() {
    const req = {
      user: {
        email: 'user@gmail.com',
        role: 'SOME-ROLE'
      }
    };
    const res = {
      json: sinon.spy()
    };
    res.status = sinon.stub().returns(res);
    const next = sinon.spy();
    return { req, res, next };
  }

  describe('requireUser', () => {
    it('calls next for authenticated users', () => {
      const { req, res, next } = getMocks();

      requireUser(req, res, next);

      assert.calledOnce(next);
      assert.calledWithExactly(next);
    });

    it('responds with 401 to unauthenticated users', () => {
      const { req, res, next } = getMocks();
      delete req.user;

      requireUser(req, res, next);

      assert.calledWithExactly(res.status, 401);
      assert.calledWithExactly(res.json);
    });
  });

  describe('requireRole', () => {
    it('calls next for users with the matching role', () => {
      const { req, res, next } = getMocks();

      requireRole('SOME-ROLE')(req, res, next);

      assert.calledOnce(next);
      assert.calledWithExactly(next);
    });

    it('responds with 401 to unauthenticated users', () => {
      const { req, res, next } = getMocks();
      delete req.user;

      requireRole('SOME-ROLE')(req, res, next);

      assert.calledWithExactly(res.status, 401);
      assert.calledWithExactly(res.json);
    });

    it('responds with 401 to users with wrong role', () => {
      const { req, res, next } = getMocks();

      requireRole('DIFFERENT-ROLE')(req, res, next);

      assert.calledWithExactly(res.status, 401);
      assert.calledWithExactly(res.json);
    });
  });
});
