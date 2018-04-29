'use strict';

const { broadcast, events } = require('./channel');
const addHooks = require('../shared/util/addHooks');
const pick = require('lodash/pick');

module.exports = { add };

function add(Comment) {
  addHooks(Comment, ['afterCreate'], (hook, instance) => {
    instance.getAuthor().then(a => {
      const author = pick(a, ['id', 'email']);
      broadcast(events.CREATE, { ...instance.dataValues, author });
    });
  });

  addHooks(Comment, ['afterUpdate'], (hook, instance) => {
    broadcast(events.UPDATE, instance);
  });

  addHooks(Comment, ['afterDelete'], (hook, instance) => {
    Comment.findById(instance.id, { paranoid: false }).then(deleted => {
      broadcast(events.DELETE, deleted);
    });
  });
}
