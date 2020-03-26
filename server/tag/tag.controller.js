'use strict';

const { Repository, Tag, User } = require('../shared/database');
const yn = require('yn');

function list({ user, query: { associated } }, res) {
  const options = user.isAdmin() || yn(associated)
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
