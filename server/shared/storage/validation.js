'use strict';

const yup = require('yup');
const { ValidationError } = yup;

yup.addMethod(yup.string, 'pkcs1', function () {
  function isValid(value) {
    if (!value) return false;
    const isValidStart = value.startsWith('-----BEGIN RSA PRIVATE KEY-----');
    const isValidEnd = value.endsWith('-----END RSA PRIVATE KEY-----');
    return isValidStart && isValidEnd;
  }
  return this.test('format', 'Invalid private key format', isValid);
});

module.exports = {
  validateConfig
};

function validateConfig(config, schema) {
  try {
    return schema.validateSync(config, { stripUnknown: true });
  } catch (error) {
    if (!ValidationError.isError(error)) throw error;
    const err = new Error('Unsupported config structure');
    err.cause = error;
    throw err;
  }
}
