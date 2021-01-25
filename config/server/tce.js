'use strict';

const camelCase = require('lodash/camelCase');

const tceConfig = Object.keys(process.env)
  .map(it => it.match(/^TCE_(.*)/))
  .filter(Boolean)
  .reduce((config, [prefixedKey, key]) => ({
    ...config,
    [camelCase(key)]: process.env[prefixedKey]
  }), {});

module.exports = tceConfig;
