'use strict';

const { sequelize, Task } = require('../shared/database');
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
  const data = pick(body, ATTRIBUTES);
  const existingTaskForActivity = await Task.findOne({
    where: { activityId: data.activityId }
  });
  if (existingTaskForActivity) {
    return createError(CONFLICT, 'Active task for activity already exists.');
  }
  return sequelize.transaction(async transaction => {
    const task = await Task.create({
      ...data,
      repositoryId: repository.id,
      authorId: user.id
    }, { transaction });
    return res.json({ data: task });
  });
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
