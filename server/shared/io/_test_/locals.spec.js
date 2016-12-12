const chai = require('chai');
const locals = require('../locals');

const assert = chai.assert;

describe('Request/response locals', () => {
  describe('load', () => {
    it('returns data from the "locals" property', () => {
      const obj = {
        locals: {
          a: 100,
          b: 200,
          c: {
            d: 300,
            e: 400
          }
        }
      };

      assert.equal(locals.load(obj, 'a'), 100);
      assert.equal(locals.load(obj, 'b'), 200);
      assert.equal(locals.load(obj, 'c').d, 300);
      // Supports nested paths:
      assert.equal(locals.load(obj, 'c.e'), 400);
    });

    it('returns undefined for non-existing paths', () => {
      const obj = { locals: {} };
      assert.isUndefined(locals.load(obj, 'x.y.z'));
    });
  });

  describe('save', () => {
    it('saves the value at the given path', () => {
      const obj = {};
      locals.save(obj, 'x.y.z', 100);
      assert.equal(obj.locals.x.y.z, 100);
    });

    it('overwrites the value if the path exists', () => {
      const obj = { locals: { x: { y: { z: 100 } } } };
      locals.save(obj, 'x.y', 200);
      assert.equal(obj.locals.x.y, 200);
    });

    it('merges objects at the given path', () => {
      const obj = { locals: { x: { y: { z: 100 } } } };
      locals.save(obj, 'x', { w: 300 });
      assert.deepEqual(obj.locals, { x: { y: { z: 100 }, w: 300 } });
    });
  });
});
