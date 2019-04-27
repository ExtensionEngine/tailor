'use strict';

const Hooks = require('sequelize/lib/hooks');
const mapValues = require('lodash/mapValues');

const addHook = Hooks.addHook;
Hooks.addHook = function (type) {
  if (!Hooks.hooks[type]) {
    throw new TypeError(`Hook type \`${type}\` is not registered`);
  }
  return addHook.apply(this, arguments);
};

exports.Type = mapValues(Hooks.hooks, (_, key) => key);

exports.register = (type, options = {}) => {
  Hooks.hooks[type] = options;
  exports.Type[type] = type;
};

exports.setup = Sequelize => {
  Hooks.applyTo(Sequelize);
  Hooks.applyTo(Sequelize.prototype);
  Hooks.applyTo(Sequelize.Model, true);
};

exports.withType = (type, hook) => {
  return function (...args) {
    return hook.call(this, type, ...args);
  };
};
