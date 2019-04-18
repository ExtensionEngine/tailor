'use strict';

const { hooks } = require('sequelize/lib/hooks');
const mapValues = require('lodash/mapValues');

const HookTypes = exports.HookTypes = mapValues(hooks, (_, key) => key);

const isFunction = arg => typeof arg === 'function';

exports.addHook = (Model, hookType, name, hook) => {
  checkType(hookType);
  if (isFunction(name)) {
    hook = name;
    name = null;
  }
  const wrappedHook = wrapHook(hookType, hook);
  const args = [wrappedHook];
  if (name) args.unshift(name);
  Model.addHook(hookType, ...args);
  return wrappedHook;
};

exports.removeHook = (Model, hookType, name) => {
  checkType(hookType);
  Model.removeHook(hookType, name);
};

exports.hasHook = (Model, hookType) => {
  checkType(hookType);
  return Model.hasHook(hookType, name);
};

function wrapHook(hookType, hook) {
  return function (...args) {
    return hook.call(this, hookType, ...args);
  };
}

function checkType(hookType) {
  if (!(hookType in HookTypes)) {
    throw new TypeError(`Invalid hook type: ${hookType}`);
  }
}
