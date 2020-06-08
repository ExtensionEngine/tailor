'use strict';

const { User } = require('../shared/database');

async function list({ repository }, res) {
  const data = await repository.getTasks({
    include: [
      { model: User, as: 'author' },
      { model: User, as: 'assignee' }
    ],
    where: { archivedAt: null }
  });
  return res.json({ data });
}

async function patch({ task, body }, res) {
  await task.update(body);
  const author = await task.getAuthor();
  const assignee = await task.getAssignee();
  const data = {
    ...task.toJSON(),
    assignee,
    author
  };
  return res.json({ data });
}

async function archive({ task }, res) {
  await task.update({ archivedAt: new Date() });
  return res.json({ data: task });
}

module.exports = {
  list,
  patch,
  archive
};
