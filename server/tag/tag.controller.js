'use strict';

const { Tag, Repository, User } = require('../shared/database');

function list({ user, query: { addNewTag } }, res) {
  const options = user.isAdmin() || addNewTag === 'true'
    ? {}
    : {
      include: [{
        model: Repository,
        as: 'repositories',
        attributes: ['id'],
        required: true,
        include: [{ model: User, attributes: ['id'], where: { id: user.id } }]
      }]
    };
  return Tag.findAll(options).then(tags => res.json({ data: tags }));
}

module.exports = {
  list
};
