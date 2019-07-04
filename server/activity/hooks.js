'use strict';

const Promise = require('bluebird');

exports.add = (Activity, Hooks, { TeachingElement }) => {
  Activity.addHook(Hooks.afterDestroy, async (activity, options) => {
    const { isLink, origin } = activity;
    if (!isLink) return;
    const links = await origin.getLinks(options);
    if (links.length !== 1) return;
    const [ link ] = links;
    const tes = await link.getTeachingElements(options);

    if (tes.length) {
      await Promise.each(tes, async te => {
        await te.update({ originId: null, activityId: link.id }, options);
        await te.origin.destroy(options);
      });
    }

    await link.update({
      originId: null,
      data: origin.data
    }, { ...options, revertLink: true });

    return origin.destroy(options);
  });
};
