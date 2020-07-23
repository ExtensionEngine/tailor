'use strict';

const { isOutlineActivity } = require('../../config/shared/activities');

module.exports = { add };

function add(Activity, Hooks, Models) {
  [Hooks.afterCreate, Hooks.afterUpdate, Hooks.afterDestroy]
    .forEach(type => {
      Activity.addHook(type, Hooks.withType(type, touchRepository));
      Activity.addHook(type, touchOutline);
    });

  Activity.addHook(Hooks.afterDestroy, destroyActivityTasks);

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

  function destroyActivityTasks(activity) {
    Models.Task.destroy({ where: { activityId: activity.id } });
  }
}
