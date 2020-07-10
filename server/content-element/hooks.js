'use strict';

const { processStatics, resolveStatics } = require('../shared/storage/helpers');
const forEach = require('lodash/forEach');
const get = require('lodash/get');
const hash = require('hash-obj');
const { isOutlineActivity } = require('../../config/shared/activities');
const sse = require('../shared/sse');

module.exports = { add };

function add(ContentElement, Hooks, Models) {
  const { Events } = ContentElement;

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

  function touchRepository(_, element, { context = {} }) {
    if (!isRepository(context.repository)) return Promise.resolve();
    return context.repository.update({ hasUnpublishedChanges: true });
  }

  async function touchOutline(_, element, { context = {} }) {
    if (!isRepository(context.repository)) return Promise.resolve();
    const activity = await resolveOutlineActivity(element);
    return activity && activity.touch();
  }

  ContentElement.addHook(Hooks.afterCreate, contentElement => {
    const channel = sse.channel(contentElement.repositoryId);
    if (channel) channel.send(Events.Create, { ...contentElement.toJSON() });
  });

  ContentElement.addHook(Hooks.afterUpdate, contentElement => {
    const channel = sse.channel(contentElement.repositoryId);
    if (channel) channel.send(Events.Update, contentElement);
  });

  ContentElement.addHook(Hooks.afterDestroy, contentElement => {
    ContentElement.findByPk(contentElement.id, { paranoid: false }).then(contentElement => {
      const channel = sse.channel(contentElement.repositoryId);
      if (channel) channel.send(Events.Delete, contentElement);
    });
  });
}

function resolveOutlineActivity(element) {
  return element.getActivity().then(activity => {
    return activity && isOutlineActivity(activity.type)
      ? activity
      : activity.getOutlineParent();
  });
}
