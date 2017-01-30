'use strict';

const chai = require('chai');
const sinon = require('sinon');
const requireCourseAccess = require('../requireCourseAccess');
const ADMIN = require('../../../../config/shared').role.ADMIN;

sinon.assert.expose(chai.assert, { prefix: '' });
const assert = chai.assert;

describe('Course middleware', () => {
  function getMocks() {
    const req = {
      params: {
        courseKey: '123456'
      },
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

  describe('requireCourseAccess', () => {
    it('calls next for adminstrators', () => {
      const { req, res, next } = getMocks();
      req.user.role = ADMIN;

      requireCourseAccess(req, res, next);

      assert.calledOnce(next);
      assert.calledWithExactly(next);
    });

    it('calls next for users who have access to requested course', () => {
      const { req, res, next } = getMocks();
      req.user.courses = ['654321', '123456'];

      requireCourseAccess(req, res, next);

      assert.calledOnce(next);
      assert.calledWithExactly(next);
    });

    it('responds with 401 to non-admin users without access to course', () => {
      const { req, res, next } = getMocks();

      requireCourseAccess(req, res, next);

      assert.calledWithExactly(res.status, 401);
      assert.calledWithExactly(res.json);
    });
  });
});
