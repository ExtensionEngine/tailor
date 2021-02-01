'use strict';

const forEach = require('lodash/forEach');
const mail = require('../shared/mail');
const { Op } = require('sequelize');
const sse = require('../shared/sse');

exports.add = (ActivityStatus, Hooks, { Activity }) => {
  const { Events } = ActivityStatus;

  const mappings = {
    [Hooks.afterCreate]: [withActivity(sseUpdate, notifyAssignee)]
  };

  forEach(mappings, (hooks, type) => {
    forEach(hooks, hook => {
      ActivityStatus.addHook(type, Hooks.withType(type, hook));
    });
  });

  function sseUpdate(_, activity) {
    sse.channel(activity.repositoryId).send(Events.Update, activity);
  }

  async function notifyAssignee(_, activity) {
    const { status } = activity;
    const previousStatus = await ActivityStatus.findOne({
      where: {
        [Op.not]: { id: status.id },
        activityId: status.activityId
      },
      order: [['createdAt', 'DESC']]
    });
    if (previousStatus.assigneeId === status.assigneeId) return;
    sendEmailNotification(activity);
  }

  function withActivity(...hooks) {
    return (type, status) => Activity
      .findOne({ where: { id: status.activityId } })
      .then(activity => hooks.forEach(hook => hook(type, activity)));
  }
};

async function sendEmailNotification(activity) {
  if (!activity.assignee) return;
  mail.sendAssigneeNotification(activity.assignee.email, activity);
}
