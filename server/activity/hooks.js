'use strict';

module.exports = { add };

function add(Activity, Hooks, Models) {
  [Hooks.afterCreate, Hooks.afterUpdate, Hooks.afterDestroy]
    .forEach(type => {
      Activity.addHook(type, touchRepository);
      Activity.addHook(type, touchOutline);
    });

  const isRepository = it => it instanceof Models.Repository;

  function touchRepository(activity, { context = {} }) {
    if (!isRepository(context.repository)) return Promise.resolve();
    return context.repository.touch();
  }

  function touchOutline(activity, { context = {}, transaction }) {
    if (!isRepository(context.repository)) return Promise.resolve();
    return activity.touchOutline(context.repository, transaction);
  }
}
