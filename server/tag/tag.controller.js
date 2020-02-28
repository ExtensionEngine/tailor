'use strict';

const { Tag } = require('../shared/database');
const uniqBy = require('lodash/uniqBy');

async function list({ user, query: { name } }, res) {
  if (name) {
    return Tag.findAndCountAll({ where: { name } })
    .then(({ count }) => res.json({ data: count }));
  }
  if (user.isAdmin()) return Tag.findAll().then(tags => res.json({ data: tags }));
  const repositories = await user.getRepositories({ include: [{ model: Tag }] });
  const tags = uniqBy(repositories.reduce((acc, it) => acc.concat(it.tags), []), 'id');
  return res.json({ data: tags });
}

module.exports = {
  list
};
