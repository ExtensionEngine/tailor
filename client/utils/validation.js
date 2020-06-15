import {
  confirmed,
  email,
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
import snakeCase from 'lodash/snakeCase';
import userApi from '@/api/user';

const URL_REGEX = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;

const alphanumerical = {
  validate: value => (/\d/.test(value) && /[a-zA-Z]/.test(value)),
  message: 'The {_field_} field must contain at least 1 letter and 1 numeric value.'
};

const uniqueEmail = {
  params: ['userData'],
  validate: (email, { userData }) => {
    if (userData && email === userData.email) return true;
    return userApi.fetch({ email }).then(({ total }) => { return !total; });
  },
  message: 'The {_field_} is not unique.'
};

const url = {
  validate: value => URL_REGEX.test(value),
  message: 'The {_field_} is invalid.'
};

const rules = {
  alphanumerical,
  confirmed,
  email,
  isNot,
  max,
  maxValue,
  min,
  minValue,
  numeric,
  required,
  uniqueEmail,
  url
};

forEach(rules, (rule, name) => extend(snakeCase(name), rule));
