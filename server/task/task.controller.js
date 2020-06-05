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

module.exports = {
  list
};
