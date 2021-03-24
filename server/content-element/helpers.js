'use strict';

const { AFTER_LOADED, AFTER_RETRIEVE } = require('../shared/content-plugins/elementHooks');
const { elementRegistry } = require('../shared/content-plugins');
const Promise = require('bluebird');
const { resolveStatics } = require('../shared/storage/helpers');

function applyFetchHooks(element) {
  const hooks = [AFTER_RETRIEVE, AFTER_LOADED]
    .map(hook => elementRegistry.getHook(element.type, hook))
    .filter(Boolean);
  return Promise.reduce([...hooks, resolveStatics], applyHook, element);
}

module.exports = { applyFetchHooks };

function applyHook(element, hook) {
  return hook(element);
}
