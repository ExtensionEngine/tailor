'use strict';

const mail = require('../shared/mail');
const pick = require('lodash/pick');
const sse = require('../shared/sse');

exports.add = (Task, Hooks) => {
  const { Events } = Task;

  Task.addHook(Hooks.afterCreate, task => {
    const channel = sse.channel(task.repositoryId);
    if (channel) channel.send(Events.Create, task);
    sendEmailNotification(task);
  });
  Task.addHook(Hooks.afterUpdate, task => {
    const channel = sse.channel(task.repositoryId);
    if (channel) channel.send(Events.Update, task);
    if (!task._changed.has('assigneeId')) return;
    sendEmailNotification(task);
  });
  Task.addHook(Hooks.afterDestroy, task => {
    const channel = sse.channel(task.repositoryId);
    if (channel) channel.send(Events.Delete, task);
  });
};

async function sendEmailNotification(task) {
  const assignee = await task.getAssignee();
  const activity = await task.getActivity();
  if (!assignee) return;
  const data = pick(task, ['id', 'repositoryId', 'description']);
  mail.sendTaskAssigneeNotification(assignee.email, activity, data);
}
