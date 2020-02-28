'use strict';

const { Tag, Repository, User } = require('../shared/database');

function list({ user }, res) {
  const include = [{
    model: Repository,
    as: 'repositories',
    attributes: ['id'],
    required: true,
    include: [{ model: User, attributes: ['id'], where: { id: user.id } }]
  }];
  const options = {};
  if (!user.isAdmin()) options.include = include;
  return Tag.findAll(options).then(tags => res.json({ data: tags }));
}

module.exports = {
  list
};
