'use strict';

const { Activity, sequelize, Task } = require('../shared/database');
const pick = require('lodash/pick');
const ATTRIBUTES = [
  'name', 'description', 'priority', 'status', 'dueDate',
  'assigneeId', 'activityId'
];

async function list({ repository }, res) {
  const data = await repository.getTasks({
    where: { archivedAt: null }
  });
  return res.json({ data });
}

async function create({ body, repository, user }, res) {
  const { activityId, ...data } = pick(body, ATTRIBUTES);
  return sequelize.transaction(async transaction => {
    const task = await Task.create({
      ...data,
      repositoryId: repository.id,
      authorId: user.id
    }, { transaction });
    await Activity.update({ taskId: task.id }, {
      where: { id: activityId },
      transaction
    });
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
