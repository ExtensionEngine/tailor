'use strict';

const forEach = require('lodash/forEach');
const mail = require('../shared/mail');
const { Op } = require('sequelize');
const sse = require('../shared/sse');

exports.add = (ActivityStatus, Hooks) => {
  const { Events } = ActivityStatus;

  const mappings = {
    [Hooks.afterCreate]: [sseCreate, notifyAssignee]
  };

  forEach(mappings, (hooks, type) => {
    forEach(hooks, hook => {
      ActivityStatus.addHook(type, Hooks.withType(type, hook));
    });
  });

  async function sseCreate(_, status) {
    const activity = await status.getActivity();
    sse.channel(status.repositoryId).send(Events.Update, { ...activity, status });
  }

  async function notifyAssignee(_, status) {
    const previousStatus = await ActivityStatus.findOne({
      where: {
        [Op.not]: { id: status.id },
        activityId: status.activityId
      },
      order: [['createdAt', 'DESC']]
    });
    if (previousStatus.assigneeId === status.assigneeId) return;
    sendEmailNotification(status);
  }
};

async function sendEmailNotification(activityStatus) {
  const assignee = await activityStatus.getAssignee();
  const activity = await activityStatus.getActivity();
  if (!assignee) return;
  mail.sendAssigneeNotification(assignee.email, {
    ...activity.toJSON(),
    status: activityStatus
  });
}
