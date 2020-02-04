'use strict';

const { Tag } = require('../shared/database');

async function list(_, res) {
  const tags = await Tag.findAll();
  return res.json({ data: tags });
}

module.exports = {
  list
};
