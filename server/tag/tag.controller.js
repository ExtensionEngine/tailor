'use strict';

const { Tag } = require('../shared/database');
const uniqBy = require('lodash/uniqBy');

async function list({ user }, res) {
  if (user.isAdmin()) return Tag.findAll().then(it => res.json({ data: it }));
  const repositories = await user.getRepositories({ include: [{ model: Tag }] });
  const tags = repositories.reduce((acc, it) => acc.concat(it.tags), []);
  const filtered = uniqBy(tags, 'id');
  return res.json({ data: filtered });
}

module.exports = {
  list
};
