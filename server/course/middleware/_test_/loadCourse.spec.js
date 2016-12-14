'use strict';

const chai = require('chai');
const sinon = require('sinon');
const loadCourse = require('../loadCourse');
const { locals } = require('../../../shared/io');

sinon.assert.expose(chai.assert, { prefix: '' });
const assert = chai.assert;

describe('Course middleware', () => {
  function getMocks() {
    const req = {
      params: {
        courseKey: 'some-course-key'
      }
    };
    const res = {};
    return { req, res };
  }

  describe('loadCourse', () => {
    it('loads course by key, saves it to req, calls next', done => {
      const { req, res } = getMocks();
      const course = {
        name: 'important course'
      };
      const model = {
        getByKey: sinon.stub().returns(Promise.resolve(course))
      };

      loadCourse(model)(req, res, err => {
        assert.isUndefined(err);
        assert.deepEqual(locals.load(req, 'course'), course);
        done();
      });
    });

    it('calls next with error from course model', done => {
      const { req, res } = getMocks();
      const error = new Error('course module error');
      const model = {
        getByKey: sinon.stub().returns(Promise.reject(error))
      };

      loadCourse(model)(req, res, err => {
        assert.deepEqual(err, error);
        done();
      });
    });
  });
});
