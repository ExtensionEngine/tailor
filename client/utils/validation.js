import isObject from 'lodash/isObject';
import tagApi from '@/api/tag';
import userApi from '@/api/user';
import VeeValidate from 'vee-validate';

const alphanumerical = {
  getMessage: field => {
    return `The ${field} field must contain at least 1 letter and 1 numeric value.`;
  },
  validate: value => {
    return (/\d/.test(value) && /[a-zA-Z]/.test(value));
  }
};

const uniqueEmail = {
  getMessage: field => `The ${field} is not unique.`,
  validate: (email, user) => {
    if (user && email === user.email) return true;
    return userApi.fetch({ email }).then(({ total }) => ({ valid: !total }));
  }
};

const uniqueTagName = {
  getMessage: field => `Tag ${field} is not unique.`,
  validate: name => {
    return tagApi.list()
      .then(tags => ({ valid: isObject(name) || !tags.find(it => it.name.toLowerCase() === name.toLowerCase()) }));
  }
};

VeeValidate.Validator.extend('alphanumerical', alphanumerical);
VeeValidate.Validator.extend('unique-email', uniqueEmail);
VeeValidate.Validator.extend('unique-tag-name', uniqueTagName);

export default VeeValidate;

const mixin = ({ inherit = false } = {}) => {
  if (inherit) return { inject: ['$validator'] };
  return {
    $_veeValidate: {
      validator: 'new'
    }
  };
};

export const withValidation = mixin;
