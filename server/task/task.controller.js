'use strict';

const { Activity, Task } = require('../shared/database');
const { CONFLICT } = require('http-status-codes');
const { createError } = require('../shared/error/helpers');
const pick = require('lodash/pick');

const ATTRIBUTES = [
  'assigneeId', 'description', 'priority',
  'status', 'dueDate', 'columnPosition'
];

async function list({ repository }, res) {
  const data = await repository.getTasks();
  return res.json({ data });
}

async function create({ body, repository, user }, res) {
  const { activityId, ...data } = pick(body, [...ATTRIBUTES, 'uid', 'activityId']);
  const activity = await Activity.findOne({
    where: { id: activityId },
    include: [{ model: Task, required: false }]
  });
  if (activity.tasks.length) {
    return createError(CONFLICT, 'Active task for activity already exists.');
  }
  const lastColumnPosition = await Task.max('columnPosition', {
    where: { status: data.status }
  });
  const columnPosition = Number.isNaN(lastColumnPosition)
    ? 1
    : lastColumnPosition + 1;
  const task = await activity.createTask({
    ...data,
    columnPosition,
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
