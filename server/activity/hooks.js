'use strict';

const Promise = require('bluebird');

exports.add = (Activity, Hooks) => {
  Activity.addHook(Hooks.afterDestroy, async activity => {
    const { isLink, origin } = activity;
    if (!isLink) return;
    const links = await origin.getLinks();
    if (links.length !== 1) return;
    const [ link ] = links;
    const originTes = await origin.getTeachingElements();
    if (originTes.length) {
      await Promise.each(originTes, tes => tes.update({
        originId: null,
        activityId: link.id
      }));
    }
    await link.update({
      originId: null,
      data: origin.data
    }, { revertLink: true });
    await origin.destroy();
    return link;
  });
};
