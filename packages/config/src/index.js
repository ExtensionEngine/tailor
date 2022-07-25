'use strict';

const isEmpty = require('lodash/isEmpty');
const mergeConfig = require('./utils/mergeConfig');
const parseSchemas = require('./schema-parser');

/* eslint-disable */
const defaultConfiguration = require('./activities-rc');
const customConfiguration = require('./activities-rc.load')();
/* eslint-enable */
if (!process.env.ENABLE_DEFAULT_SCHEMA && !isEmpty(customConfiguration)) {
  defaultConfiguration.SCHEMAS = [];
}

const { SCHEMAS } = mergeConfig(defaultConfiguration, customConfiguration);
parseSchemas(SCHEMAS);
const schema = require('./schema')(SCHEMAS, defaultConfiguration);
const workflow = require('./workflow')(schema);

module.exports = {
  SCHEMAS,
  schema,
  workflow
};
