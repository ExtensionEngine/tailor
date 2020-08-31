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
  required
} from 'vee-validate/dist/rules';
import { extend } from 'vee-validate';
import forEach from 'lodash/forEach';
import { messages } from 'vee-validate/dist/locale/en.json';
import snakeCase from 'lodash/snakeCase';
import userApi from '@/api/user';

const URL_REGEX = /^(https?:\/\/)?((?=[a-z0-9-]{2,})([a-z0-9]+(-[a-z0-9]+)?)\.)+[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/i;

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
  validate: value => URL_REGEX.test(value),
  message: 'The {_field_} is not a valid URL'
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
  required,
  uniqueEmail,
  url
};

forEach(rules, (rule, name) => extend(snakeCase(name), { message: messages[name], ...rule }));
