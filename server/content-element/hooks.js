'use strict';

const { processStatics, resolveStatics } = require('../shared/storage/helpers');
const elementHooks = require('../shared/content-plugins/elementHooks');
const { elementRegistry } = require('../shared/content-plugins');
const forEach = require('lodash/forEach');
const get = require('lodash/get');
const hash = require('hash-obj');
const { isOutlineActivity } = require('../../config/shared/activities');
const sse = require('../shared/sse');

module.exports = { add };

function add(ContentElement, Hooks, Models) {
  const { Events } = ContentElement;

  const mappings = {
    [Hooks.beforeCreate]: [customElementHook, processAssets],
    [Hooks.beforeUpdate]: [customElementHook, processAssets],
    [Hooks.afterCreate]: [customElementHook, resolveAssets, sseCreate, touchRepository, touchOutline],
    [Hooks.afterUpdate]: [customElementHook, resolveAssets, sseUpdate, touchRepository, touchOutline],
    [Hooks.beforeDestroy]: [touchRepository, touchOutline],
    [Hooks.afterDestroy]: [sseDelete]
  };
  const elementHookMappings = {
    [Hooks.beforeCreate]: elementHooks.BEFORE_SAVE,
    [Hooks.beforeUpdate]: elementHooks.BEFORE_SAVE,
    [Hooks.afterCreate]: elementHooks.AFTER_SAVE,
    [Hooks.afterUpdate]: elementHooks.AFTER_SAVE
  };

  forEach(mappings, (hooks, type) => {
    forEach(hooks, hook => {
      ContentElement.addHook(type, Hooks.withType(type, hook));
    });
  });

  const isRepository = it => it instanceof Models.Repository;

  function sseCreate(_, element) {
    sse.channel(element.repositoryId).send(Events.Create, element);
  }

  function sseUpdate(_, element) {
    sse.channel(element.repositoryId).send(Events.Update, element);
  }

  async function sseDelete(_, element) {
    await element.reload({ paranoid: false });
    sse.channel(element.repositoryId).send(Events.Delete, element);
  }

  function customElementHook(hookType, element) {
    hookType = elementHookMappings[hookType];
    if (!hookType) return;
    const hook = elementRegistry.getHook(element.type, hookType);
    return hook && hook(element);
  }

  function processAssets(hookType, element) {
    // pruneVirtualProps
    // data.assets is an obj containing asset urls where key represents location
    // within data (where it should be resolved). If asset is internal
    // it will have storage:// protocol set.
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

  function touchRepository(_, _element, { context = {} }) {
    if (!isRepository(context.repository)) return Promise.resolve();
    return context.repository.update({ hasUnpublishedChanges: true });
  }

  async function touchOutline(_, element, { context = {} }) {
    if (!isRepository(context.repository)) return Promise.resolve();
    const activity = await resolveOutlineActivity(element);
    return activity && activity.touch();
  }
}

function resolveOutlineActivity(element) {
  return element.getActivity().then(activity => {
    return activity && isOutlineActivity(activity.type)
      ? activity
      : activity.getOutlineParent();
  });
}
