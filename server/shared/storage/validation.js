const Joi = require('Joi');

function validateConfig(config, schema) {
  const options = { stripUnknown: true };
  let validated;

  Joi.validate(config, schema, options, (err, value) => {
    if (err) {
      throw Error('Unsupported config structure');
    } else {
      validated = value;
    }
  });

  return validated;
}

module.exports = {
  validateConfig
};
