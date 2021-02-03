'use strict';

const forEach = require('lodash/forEach');
const { getLevel } = require('../../config/shared/activities');
const mail = require('../shared/mail');
const { Op } = require('sequelize');
const sse = require('../shared/sse');

exports.add = (ActivityStatus, Hooks, { Activity }) => {
  const { Events } = ActivityStatus;

  const mappings = {
    [Hooks.afterCreate]: [withActivity(sseUpdate, notifyAssignee)],
    [Hooks.afterBulkCreate]: [withActivity(sseUpdate, notifyAssignee)]
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
    const [status] = activity.status;
    if (!status.assigneeId) return;
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
    return afterTransaction((type, status, opts) => {
      Activity
        .findOne({ where: { id: status.activityId } })
        .then(activity => hooks.forEach(hook => hook(type, activity)));
    });
  }
};

async function sendEmailNotification(activity) {
  const { label } = getLevel(activity.type);
  const [status] = activity.status;
  mail.sendAssigneeNotification(status.assignee.email, {
    ...activity.toJSON(),
    label: label.toLowerCase()
  });
}

const afterTransaction = method => (type, status, opts) => {
  if (!opts.transaction) return method(type, status, opts);
  opts.transaction.afterCommit(() => method(type, status, opts));
};
