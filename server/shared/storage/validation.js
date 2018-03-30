'use strict';

module.exports = {
  validateConfig
};

function validateConfig(config, schema) {
  const { error, value } = schema.validate(config, { stripUnknown: true });
  if (!error) return value;
  const err = new Error('Unsupported config structure');
  err.cause = error;
  throw err;
}
