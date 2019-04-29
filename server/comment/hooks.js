'use strict';

const { broadcast, events } = require('./channel');
const pick = require('lodash/pick');

exports.add = (Comment, { HookType }) => {
  Comment.addHook(HookType.afterCreate, comment => {
    comment.getAuthor().then(a => {
      const author = pick(a, ['id', 'email']);
      broadcast(events.CREATE, { ...comment.toJSON(), author });
    });
  });

  Comment.addHook(HookType.afterUpdate, comment => {
    broadcast(events.UPDATE, comment);
  });

  Comment.addHook(HookType.afterDestroy, comment => {
    Comment.findByPk(comment.id, { paranoid: false }).then(deleted => {
      broadcast(events.DELETE, deleted);
    });
  });
};
