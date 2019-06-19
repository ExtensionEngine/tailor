'use strict';
const find = require('lodash/find');

exports.add = (Activity, Hooks) => {
  Activity.addHook(Hooks.afterDestroy, async activity => {
    if (!activity.originId) return;
    const origin = await activity.getOrigin();
    const links = await origin.getLinks();
    if (links.length > 1) return;
    const link = find(links, link => link.id !== activity.id);
    return link.update({
      originId: null,
      data: origin.data
    }).then(() => origin.destroy());
  });
};
