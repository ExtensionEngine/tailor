'use strict';

const find = require('lodash/find');
const Promise = require('bluebird');

exports.add = (Activity, Hooks, { TeachingElement }) => {
  Activity.addHook(Hooks.afterDestroy, async activity => {
    if (!activity.originId) return;
    const origin = await activity.getOrigin();
    const links = await origin.getLinks();
    if (links.length > 1) return;
    try {
      const link = find(links, link => link.id !== activity.id);

      const tes = await TeachingElement.findAll(
        { where: { activityId: origin.id, detached: false } }
      );
      const children = await Activity.findAll(
        { where: { parentId: origin.id, detached: false } },
      );

      if (tes.length) {
        await Promise.each(tes,
          te => te.update(
            { activityId: link.id },
          )
        );
      }

      if (children.length) {
        await Promise.each(children,
          child => child.update(
            { parentId: link.id },
          )
        );
      }

      await link.save();
      await origin.destroy();
    } catch (e) {
      console.log(e);
    }
  });
};
