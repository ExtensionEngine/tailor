'use strict';

const { hooks } = require('sequelize/lib/hooks');
const mapValues = require('lodash/mapValues');

const Hooks = mapValues(hooks, (_, key) => key);

Hooks.withType = (hookType, hook) => {
  return function (...args) {
    return hook.call(this, hookType, ...args);
  };
};

module.exports = Hooks;
