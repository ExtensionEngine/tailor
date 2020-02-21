'use strict';

const { processStatics, resolveStatics } = require('../shared/storage/helpers');
const forEach = require('lodash/forEach');
const get = require('lodash/get');
const hash = require('hash-obj');

module.exports = { add };

function add(ContentElement, Hooks, Models) {
  const mappings = {
    [Hooks.beforeCreate]: [processAssets],
    [Hooks.beforeUpdate]: [processAssets],
    [Hooks.afterCreate]: [resolveAssets, touchRepository, touchOutline],
    [Hooks.afterUpdate]: [resolveAssets, touchRepository, touchOutline],
    [Hooks.beforeDestroy]: [touchRepository, touchOutline]
  };

  forEach(mappings, (hooks, type) => {
    forEach(hooks, hook => {
      ContentElement.addHook(type, Hooks.withType(type, hook));
    });
  });

  const isRepository = it => it instanceof Models.Repository;

  function processAssets(hookType, element) {
    const assets = get(element, 'data.assets', {});
    forEach(assets, key => delete element.data[key]);
    const isUpdate = hookType === Hooks.beforeUpdate;
    if (isUpdate && !element.changed('data')) return Promise.resolve();
    element.contentSignature = hash(element.data, { algorithm: 'sha1' });
    return processStatics(element);
  }

  function resolveAssets(_, element) {
    return resolveStatics(element);
  }

  function touchRepository(_, element, { context = {} }) {
    if (!isRepository(context.repository)) return Promise.resolve();
    return context.repository.touch();
  }

  function touchOutline(_, element, { context = {} }) {
    if (!isRepository(context.repository)) return Promise.resolve();
    return element.getActivity().then(activity => {
      return activity && activity.touchOutline(context.repository);
    });
  }
}
