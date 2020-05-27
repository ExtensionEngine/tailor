import * as rules from 'vee-validate/dist/rules';
import { extend } from 'vee-validate';
import { messages } from 'vee-validate/dist/locale/en.json';
import userApi from '@/api/user';

Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule], // copies rule configuration
    message: messages[rule] // assign message
  });
});

extend('alphanumerical', {
  validate(value) {
    return (/\d/.test(value) && /[a-zA-Z]/.test(value));
  },
  message: fieldName => {
    return `The ${fieldName} field must contain at least 1 letter and 1 numeric value.`;
  }
});

extend('uniqueEmail', {
  params: ['userData'],
  validate: (email, { userData }) => {
    if (userData && email === userData.email) return true;
    return userApi.fetch({ email }).then(({ total }) => { return !total; });
  },
  message: fieldName => {
    return `The ${fieldName} is not unique.`;
  }
});
