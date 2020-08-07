'use strict';

const { Activity } = require('../shared/database');
const { CONFLICT } = require('http-status-codes');
const { createError } = require('../shared/error/helpers');
const pick = require('lodash/pick');
const ATTRIBUTES = [
  'name', 'description', 'priority', 'status', 'dueDate',
  'assigneeId', 'activityId'
];

async function list({ repository }, res) {
  const data = await repository.getTasks();
  return res.json({ data });
}

async function create({ body, repository, user }, res) {
  const { activityId, ...data } = pick(body, ATTRIBUTES);
  const activity = await Activity.findOne({
    where: { id: activityId }
  });
  const tasks = await activity.getTasks();
  if (tasks.length) {
    return createError(CONFLICT, 'Active task for activity already exists.');
  }
  const task = await activity.createTask({
    ...data,
    repositoryId: repository.id,
    authorId: user.id
  });
  return res.json({ data: task });
}

async function patch({ task, body }, res) {
  await task.update(pick(body, ATTRIBUTES));
  return res.json({ data: task });
}

async function archive({ task }, res) {
  await task.update({ archivedAt: new Date() });
  return res.json({ data: task });
}

module.exports = {
  list,
  create,
  patch,
  archive
};
