'use strict';

const { broadcast, events } = require('./channel');

exports.add = (Comment, Hooks) => {
  Comment.addHook(Hooks.afterCreate, comment => {
    comment.getAuthor().then(a => {
      broadcast(events.CREATE, { ...comment.toJSON(), author: a.profile });
    });
  });

  Comment.addHook(Hooks.afterUpdate, comment => {
    broadcast(events.UPDATE, comment);
  });

  Comment.addHook(Hooks.afterDestroy, comment => {
    Comment.findByPk(comment.id, { paranoid: false }).then(deleted => {
      broadcast(events.DELETE, deleted);
    });
  });
};
