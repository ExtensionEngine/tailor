'use strict';

const { User } = require('../shared/database');

async function list({ repository }, res) {
  const data = await repository.getTasks({
    include: [
      { model: User, as: 'author' },
      { model: User, as: 'assignee' }
    ]
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

module.exports = {
  list,
  patch
};
