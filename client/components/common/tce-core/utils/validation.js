import VeeValidate from 'vee-validate';

const alphanumerical = {
  getMessage: field => {
    return `The ${field} field must contain at least 1 letter and 1 numeric value.`;
  },
  validate: value => {
    return (/\d/.test(value) && /[a-zA-Z]/.test(value));
  }
};

VeeValidate.Validator.extend('alphanumerical', alphanumerical);

const withValidation = ({ inherit = false } = {}) => {
  if (inherit) return { inject: ['$validator'] };
  return {
    $_veeValidate: {
      validator: 'new'
    }
  };
};

export { VeeValidate, withValidation };
