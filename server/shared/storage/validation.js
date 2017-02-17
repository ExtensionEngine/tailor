const Joi = require('joi');

function validateConfig(config, schema) {
  const options = { stripUnknown: true };
  return Joi.validate(config, schema, options, (err, value) => {
    if (err) throw Error('Unsupported config structure');
    return value;
  });
}

module.exports = {
  validateConfig
};
