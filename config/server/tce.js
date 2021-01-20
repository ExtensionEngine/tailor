'use strict';

const camelCase = require('lodash/camelCase');

const envs = process.env;
const regex = new RegExp('^TCE_(.*)');

const tceConfig = Object.keys(envs)
  .map(it => it.match(regex))
  .filter(Boolean)
  .map(([env, secret]) => ({ env, secret: camelCase(secret) }))
  .reduce((config, { env, secret }) => ({
    ...config,
    [secret]: process.env[env]
  }), {});

module.exports = tceConfig;
