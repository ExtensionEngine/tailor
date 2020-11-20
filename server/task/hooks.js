'use strict';

const forEach = require('lodash/forEach');
const mail = require('../shared/mail');
const pick = require('lodash/pick');
const sse = require('../shared/sse');

exports.add = (Task, Hooks) => {
  const { Events } = Task;

  const mappings = {
    [Hooks.afterCreate]: [sseCreate, notifyAssignee],
    [Hooks.afterUpdate]: [sseUpdate, notifyAssigneeIfAssigned],
    [Hooks.afterDestroy]: [sseDelete]
  };

  forEach(mappings, (hooks, type) => {
    forEach(hooks, hook => {
      Task.addHook(type, Hooks.withType(type, hook));
    });
  });

  function sseCreate(_, task) {
    sse.channel(task.repositoryId).send(Events.Create, task);
  }

  function sseUpdate(_, task) {
    sse.channel(task.repositoryId).send(Events.Update, task);
  }

  function sseDelete(_, task) {
    sse.channel(task.repositoryId).send(Events.Delete, task);
  }

  function notifyAssignee(_, task) {
    sendEmailNotification(task);
  }

  function notifyAssigneeIfAssigned(_, task) {
    if (!task._changed.has('assigneeId')) return;
    sendEmailNotification(task);
  }
};

async function sendEmailNotification(task) {
  const assignee = await task.getAssignee();
  const activity = await task.getActivity();
  if (!assignee) return;
  const data = pick(task, ['id', 'repositoryId', 'description']);
  mail.sendTaskAssigneeNotification(assignee.email, activity, data);
}
