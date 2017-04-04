import VeeValidate from 'vee-validate';

VeeValidate.Validator.extend('alphanumerical', {
  getMessage: field => {
    return `The ${field} field must contain at least 1 letter and 1 numeric value.`;
  },
  validate: value => {
    return (/\d/.test(value) && /[a-zA-Z]/.test(value));
  }
});

export default VeeValidate;
