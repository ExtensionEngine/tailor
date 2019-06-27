'use strict';

const Promise = require('bluebird');

exports.add = (Activity, Hooks) => {
  Activity.addHook(Hooks.afterDestroy, async (activity, options) => {
    const { isLink, origin } = activity;
    if (!isLink) return;
    const links = await origin.getLinks(options);
    if (links.length !== 1) return;
    const [ link ] = links;
    const originTes = await origin.getTeachingElements(options);

    if (originTes.length) {
      await Promise.each(originTes, tes => tes.update({
        originId: null,
        activityId: link.id
      }, options));
    }

    await link.update({
      originId: null,
      data: origin.data
    }, { ...options, revertLink: true });
    return origin.destroy(options);
  });
};
