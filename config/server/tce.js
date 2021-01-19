'use strict';

const camelCase = require('lodash/camelCase');
const coreElements = require('../shared/core-elements');
const extensionElements = require('../../extensions/content-elements');
const snakeCase = require('lodash/snakeCase');

const elements = [...coreElements, ...extensionElements]
  .map(it => snakeCase(it).toUpperCase());
const envs = process.env;
const regex = new RegExp(`^(${elements.join('|')})_(.*)`);

const tceConfig = Object.keys(envs)
  .map(it => it.match(regex))
  .filter(Boolean)
  .map(([env, element, secret]) => ({ env, element: camelCase(element), secret: camelCase(secret) }))
  .reduce((acc, { env, element, secret }) => ({
    ...acc,
    [element]: {
      ...acc[element],
      [secret]: process.env[env]
    }
  }), {});

module.exports = tceConfig;
