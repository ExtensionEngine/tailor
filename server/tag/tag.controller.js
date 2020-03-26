'use strict';

const { Tag } = require('../shared/database');
const yn = require('yn');

function list({ user, query: { associated } }, res) {
  const options = yn(associated)
    ? { include: [Tag.getAssociated(user)] }
    : {};
  return Tag.findAll(options).then(tags => res.json({ data: tags }));
}

module.exports = {
  list
};
