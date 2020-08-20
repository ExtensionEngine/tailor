'use strict';

const { ValidationError } = require('yup');

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
