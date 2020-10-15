import {
  confirmed,
  email,
  ext,
  integer,
  is_not as isNot,
  max,
  max_value as maxValue,
  min,
  min_value as minValue,
  numeric,
  required
} from 'vee-validate/dist/rules';
import { extend } from 'vee-validate';
import forEach from 'lodash/forEach';
import isURL from 'validator/lib/isURL';
import { messages } from 'vee-validate/dist/locale/en.json';
import snakeCase from 'lodash/snakeCase';
import some from 'lodash/some';
import userApi from '@/api/user';

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

const rules = {
  alphanumerical,
  confirmed,
  email,
  ext,
  integer,
  isNot: { ...isNot, message: 'The {_field_} is equal to the {other} value' },
  max,
  maxValue: { ...maxValue, message: 'The {_field_} must be {max} or less' },
  min,
  minValue: { ...minValue, message: 'The {_field_} must be {min} or more' },
  notWithin,
  numeric,
  required,
  uniqueEmail,
  url
};

forEach(rules, (rule, name) => extend(snakeCase(name), {
  message: messages[name],
  ...rule
}));
