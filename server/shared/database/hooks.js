'use strict';

const { hooks } = require('sequelize/lib/hooks');
const mapValues = require('lodash/mapValues');

const HookTypes = mapValues(hooks, (_, key) => key);

const isFunction = arg => typeof arg === 'function';
const noop = () => {};

exports.HookTypes = HookTypes;

exports.addHook = (Model, hookType, name, hook) => {
  checkType(hookType);
  if (isFunction(name)) {
    hook = name;
    name = null;
  }
  Model.addHook(hookType, name, function (...args) {
    return hook.call(this, hookType, ...args);
  });
};

exports.addHooks = (Model, hookTypes = [], hook = noop) => {
  hookTypes.forEach(it => exports.addHook(Model, it, hook));
};

exports.removeHook = (Model, hookType, name) => {
  checkType(hookType);
  return Model.removeHook(hookType, name);
};

exports.hasHook = (Model, hookType) => {
  checkType(hookType);
  return Model.hasHook(hookType, name);
};

function checkType(hookType) {
  if (!(hookType in HookTypes)) {
    throw new TypeError(`Invalid hook type: ${hookType}`);
  }
}
