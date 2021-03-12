import * as rules from 'vee-validate/dist/rules';
import { extend } from 'vee-validate';
import forEach from 'lodash/forEach';
import isURL from 'validator/lib/isURL';
import { messages } from 'vee-validate/dist/locale/en.json';
import some from 'lodash/some';
import { user as userApi } from '@tailor/api';

const nameFormat = {
  validate: value => {
    const hasValidUnicodeLetters = /^[\p{Letter}\s'-.]+$/u.test(value);
    const hasPunctuationStreak = /['-.]{2,}/.test(value);
    const hasValidBoundaries = !/^['-.].*|['.-]$/.test(value);
    return hasValidUnicodeLetters && hasValidBoundaries && !hasPunctuationStreak;
  },
  message: 'The {_field_} field is not valid'
};

const alphanumerical = {
  validate: value => (/\d/.test(value) && /[a-zA-Z]/.test(value)),
  message: 'The {_field_} field must contain at least 1 letter and 1 numeric value'
};

const uniqueEmail = {
  params: ['userData'],
  validate: (email, { userData }) => {
    if (userData && email === userData.email) return true;
    return userApi.fetch({ email }).then(({ total }) => !total);
  },
  message: 'The {_field_} is not unique'
};

const url = {
  params: ['protocols', 'require_valid_protocol', 'require_protocol'],
  validate: (val, opts) => isURL(val, opts),
  message: 'The {_field_} is not a valid URL'
};

const notWithin = {
  params: ['values', 'checkBy'],
  validate: (value, { values, checkBy }) => {
    const query = checkBy ? { [checkBy]: value } : value;
    return !some(values, query);
  },
  message: 'This {_field_} already exists'
};

const configuredRules = {
  ...rules,
  url,
  alphanumerical,
  name_format: nameFormat,
  not_within: notWithin,
  unique_email: uniqueEmail,
  is_not: { ...rules.is_not, message: 'The {_field_} is equal to the {other} value' },
  max_value: { ...rules.max_value, message: 'The {_field_} must be {max} or less' },
  min_value: { ...rules.min_value, message: 'The {_field_} must be {min} or more' }
};

forEach(configuredRules, (rule, name) => extend(name, {
  message: messages[name],
  ...rule
}));
