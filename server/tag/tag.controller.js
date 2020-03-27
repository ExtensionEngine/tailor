'use strict';

const { Tag } = require('../shared/database');
const yn = require('yn');

async function list({ user, query: { associated } }, res) {
  const tags = await (yn(associated)
    ? Tag.getAssociated(user)
    : Tag.findAll());
  return res.json({ data: tags });
}

module.exports = {
  list
};
