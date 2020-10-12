'use strict';

const forEach = require('lodash/forEach');
const { isOutlineActivity } = require('../../config/shared/activities');
const sse = require('../shared/sse');

module.exports = { add };

function add(Activity, Hooks, Models) {
  const { Events } = Activity;

  const mappings = {
    [Hooks.afterCreate]: [sseCreate, touchRepository, touchOutline],
    [Hooks.afterUpdate]: [sseUpdate, touchRepository, touchOutline],
    [Hooks.afterDestroy]: [sseDelete, touchRepository, touchOutline]
  };

  forEach(mappings, (hooks, type) => {
    forEach(hooks, hook => Activity.addHook(type, Hooks.withType(type, hook)));
  });

  function sseCreate(_, activity) {
    const channel = sse.channel(activity.repositoryId);
    if (channel) channel.send(Events.Create, activity);
  }

  function sseUpdate(_, activity) {
    const channel = sse.channel(activity.repositoryId);
    if (channel) channel.send(Events.Update, activity);
  }

  async function sseDelete(_, activity) {
    await activity.reload({ paranoid: false });
    const channel = sse.channel(activity.repositoryId);
    if (channel) channel.send(Events.Delete, activity);
  }

  const isRepository = it => it instanceof Models.Repository;

  function touchRepository(hookType, activity, { context = {} }) {
    if (!isRepository(context.repository)) return Promise.resolve();
    // setting correct hasUnpublishedChanges value is handled by
    // remove activity middleware for outline activities
    return hookType === Hooks.afterDestroy && isOutlineActivity(activity.type)
      ? Promise.resolve()
      : context.repository.update({ hasUnpublishedChanges: true });
  }

  async function touchOutline(activity, { context = {}, transaction }) {
    if (!isRepository(context.repository)) return Promise.resolve();
    const outlineActivity = isOutlineActivity(activity.type)
      ? activity
      : await activity.getOutlineParent(transaction);
    return outlineActivity && outlineActivity.touch(transaction);
  }
}
