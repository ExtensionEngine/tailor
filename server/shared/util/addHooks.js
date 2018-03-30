'use strict';

module.exports = function addHooks(Model, hooks, fn) {
  hooks.forEach(hook => Model.hook(hook, function (instance, options) {
    return fn.call(this, hook, instance, options);
  }));
};
