'use strict';

async function list({ repository }, res) {
  const data = await repository.getTasks();
  return res.json({ data });
}

module.exports = {
  list
};
