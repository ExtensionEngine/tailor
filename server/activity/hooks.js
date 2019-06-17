'use strict';

const find = require('lodash/find');
const Promise = require('bluebird');

exports.add = (Activity, Hooks, { TeachingElement }) => {
  // TODO: Needs more work
  Activity.addHook(Hooks.afterDestroy, async activity => {
    if (!activity.originId) return;
    const origin = await activity.getOrigin();
    const links = await origin.getLinks();
    if (links.length > 1) return;
    const link = find(links, link => link.id !== activity.id);
    const tesOpts = { where: { activityId: origin.id, detached: false } };
    const tes = await TeachingElement.findAll(tesOpts);
    const childrenOpts = { where: { parentId: origin.id, detached: false } };
    const children = await Activity.findAll(childrenOpts);

    // TODO: This won't work any more due to linking tes, need to update this
    if (tes.length) {
      await Promise.each(tes, te => te.update({ activityId: link.id }));
    }

    if (children.length) {
      await Promise.each(children, child => child.update({ parentId: link.id }));
    }

    return link.save().then(() => origin.destroy());
  });
};
