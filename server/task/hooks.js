'use strict';

const mail = require('../shared/mail');
const pick = require('lodash/pick');

exports.add = (Task, Hooks) => {
  Task.addHook(Hooks.afterCreate, task => {
    sendEmailNotification(task);
  });
  Task.addHook(Hooks.afterUpdate, task => {
    if (!task._changed.has('assigneeId')) return;
    sendEmailNotification(task);
  });
};

async function sendEmailNotification(task) {
  const assignee = await task.getAssignee();
  if (!assignee) return;
  const data = pick(task, ['name', 'description']);
  mail.sendTaskAssigneeNotification(assignee.email, data);
}
