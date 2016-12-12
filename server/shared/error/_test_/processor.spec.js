const chai = require('chai');
const sinon = require('sinon');
const config = require('../../../../config/server');
const arangoErrorProcessor = require('../arango');
const authErrorProcessor = require('../auth');
const genericErrorProcessor = require('../generic');
const validationErrorProcessor = require('../validation');

sinon.assert.expose(chai.assert, { prefix: '' });
const assert = chai.assert;

describe('Error processors', () => {
  let showDetailsOriginal = config.error.showDetails;

  beforeEach(() => {
    config.error.showDetails = true;
  });

  afterEach(() => {
    config.error.showDetails = showDetailsOriginal;
  });

  describe('ArangoDB error processor', () => {
    it('converts error 1202 to 404 Not Found', () => {
      const error = {
        isArangoError: true,
        errorNum: 1202
      };

      const result = arangoErrorProcessor.processError(error);

      assert.isTrue(arangoErrorProcessor.canProcessError(error));
      assert.strictEqual(result.status, 404);
      assert.isUndefined(result.error);
    });

    it('returns all details of an unexpected arango error', () => {
      const error = {
        isArangoError: true,
        errorNum: 123456789,
        name: 'whatever',
        message: 'something went wrong in the database'
      };

      const result = arangoErrorProcessor.processError(error);

      assert.isTrue(arangoErrorProcessor.canProcessError(error));
      assert.strictEqual(result.status, 500);
      assert.deepEqual(result.error, {
        name: error.name,
        message: error.message,
        meta: error
      });
    });

    it('hides all details of an unexpected arango error when so configured', () => {
      const error = {
        isArangoError: true,
        errorNum: 123456789,
        name: 'whatever',
        message: 'something went wrong in the database'
      };
      // Hacky, but gets the job done:
      config.error.showDetails = false;

      const result = arangoErrorProcessor.processError(error);

      assert.isTrue(arangoErrorProcessor.canProcessError(error));
      assert.strictEqual(result.status, 500);
      assert.isUndefined(result.error);
    });
  });

  describe('Authentication error processor', () => {
    it('returns 401 with error name and message', () => {
      const error = {
        isAuthError: true,
        name: 'some auth error',
        message: 'you probably mistyped your password'
      };

      const result = authErrorProcessor.processError(error);

      assert.isTrue(authErrorProcessor.canProcessError(error));
      assert.strictEqual(result.status, 401);
      assert.deepEqual(result.error, {
        name: error.name,
        message: error.message
      });
    });
  });

  describe('Validation error processor', () => {
    it('handles Joi errors, returns 400 with error name and message', () => {
      const error = {
        isJoi: true,
        name: 'some validation error',
        message: 'you probably forgot a property'
      };

      const result = validationErrorProcessor.processError(error);

      assert.isTrue(validationErrorProcessor.canProcessError(error));
      assert.strictEqual(result.status, 400);
      assert.deepEqual(result.error, {
        name: error.name,
        message: error.message
      });
    });

    it('handles validation errors, returns 400 with error name and message', () => {
      const error = {
        isValidationError: true,
        name: 'some validation error',
        message: 'you probably forgot a property'
      };

      const result = validationErrorProcessor.processError(error);

      assert.isTrue(validationErrorProcessor.canProcessError(error));
      assert.strictEqual(result.status, 400);
      assert.deepEqual(result.error, {
        name: error.name,
        message: error.message
      });
    });
  });

  describe('Generic error processor', () => {
    it('handles all errors', () => {
      assert.isTrue(genericErrorProcessor.canProcessError());
    });

    it('returns all details of an unexpected/unprocessed error', () => {
      const message = 'blue screen of death';
      const error = new Error(message);

      const result = genericErrorProcessor.processError(error);

      assert.strictEqual(result.status, 500);
      assert.deepEqual(result.error, {
        name: 'Error',
        message: error.message,
        meta: {
          stack: error.stack.split('\n')
        }
      });
    });

    it('hides all details of an unexpected error when so configured', () => {
      const message = 'blue screen of death';
      const error = new Error(message);
      // Hacky, but gets the job done:
      config.error.showDetails = false;

      const result = genericErrorProcessor.processError(error);

      assert.strictEqual(result.status, 500);
      assert.isUndefined(result.error);
    });
  });
});
