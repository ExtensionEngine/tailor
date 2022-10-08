import elementHooks from '../shared/content-plugins/elementHooks.js';
import forEach from 'lodash/forEach.js';
import get from 'lodash/get.js';
import hash from 'hash-obj';
import PluginRegistry from '../shared/content-plugins/index.js';
import Promise from 'bluebird';
import { resolveStatics } from '../shared/storage/helpers.js';
import { schema } from '../../config/shared/tailor.loader.js';
import sse from '../shared/sse/index.js';

const { elementRegistry } = PluginRegistry;

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
    [Hooks.beforeCreate]: [elementHooks.BEFORE_SAVE],
    [Hooks.beforeUpdate]: [elementHooks.BEFORE_SAVE],
    [Hooks.afterCreate]: [elementHooks.AFTER_SAVE, elementHooks.AFTER_LOADED],
    [Hooks.afterUpdate]: [elementHooks.AFTER_SAVE, elementHooks.AFTER_LOADED]
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

  function sseUpdate(hookType, element) {
    const isDetached = element.previous('detached') === false && element.detached;
    if (isDetached) return sseDelete(hookType, element);
    sse.channel(element.repositoryId).send(Events.Update, element);
  }

  async function sseDelete(_, element) {
    await element.reload({ paranoid: false });
    sse.channel(element.repositoryId).send(Events.Delete, element);
    const { Comment } = Models;
    const where = { contentElementId: element.id };
    const options = { where, returning: true, paranoid: false };
    return Comment.update({ activityId: null }, options);
  }

  function customElementHook(hookType, element, options) {
    const elementHookTypes = elementHookMappings[hookType];
    if (!elementHookTypes) return;
    return Promise.resolve(elementHookTypes)
      .map(hook => elementRegistry.getHook(element.type, hook))
      .filter(Boolean)
      .reduce((result, hook) => hook(result, options), element);
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
    return element;
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

function applyFetchHooks(element) {
  const { AFTER_RETRIEVE, AFTER_LOADED } = elementHooks;
  const applyHook = (element, hook) => hook(element);
  const hooks = [AFTER_RETRIEVE, AFTER_LOADED]
    .map(hook => elementRegistry.getHook(element.type, hook))
    .filter(Boolean);
  return Promise.reduce([...hooks, resolveStatics], applyHook, element);
}

function resolveOutlineActivity(element) {
  return element.getActivity().then(activity => {
    return activity && schema.isOutlineActivity(activity.type)
      ? activity
      : activity.getOutlineParent();
  });
}

export { add, applyFetchHooks };
export default { add, applyFetchHooks };
