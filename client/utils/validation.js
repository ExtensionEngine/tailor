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
import { messages } from 'vee-validate/dist/locale/en.json';
import snakeCase from 'lodash/snakeCase';
import userApi from '@/api/user';

const URL_REGEX = new RegExp(
  `(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}
  |www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))
  [a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})$`);

const alphanumerical = {
  validate: value => (/\d/.test(value) && /[a-zA-Z]/.test(value)),
  message: 'The {_field_} field must contain at least 1 letter and 1 numeric value.'
};

const uniqueEmail = {
  params: ['userData'],
  validate: (email, { userData }) => {
    if (userData && email === userData.email) return true;
    return userApi.fetch({ email }).then(({ total }) => !total);
  },
  message: 'The {_field_} is not unique.'
};

const extUrl = {
  params: ['extensions'],
  validate: (url, { extensions }) => extensions.some(ext => {
    return new RegExp(`\\w\\${ext}$`).test(url);
  }),
  message: 'The {_field_} is invalid.'
};

const url = {
  validate: value => URL_REGEX.test(value),
  message: 'The {_field_} is invalid.'
};

const rules = {
  alphanumerical,
  confirmed,
  email,
  extUrl,
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

forEach(rules, (rule, name) => extend(snakeCase(name), {
  message: messages[name],
  ...rule
}));
