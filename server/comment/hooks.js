'use strict';

const { broadcast, events } = require('./channel');
const pick = require('lodash/pick');

exports.add = (Comment, _, { HookTypes, addHook }) => {
  addHook(Comment, HookTypes.afterCreate, (_, comment) => {
    comment.getAuthor().then(a => {
      const author = pick(a, ['id', 'email']);
      broadcast(events.CREATE, { ...comment.toJSON(), author });
    });
  });

  addHook(Comment, HookTypes.afterUpdate, (_, comment) => {
    broadcast(events.UPDATE, comment);
  });

  addHook(Comment, HookTypes.afterDestroy, (_, comment) => {
    Comment.findByPk(comment.id, { paranoid: false }).then(deleted => {
      broadcast(events.DELETE, deleted);
    });
  });
};
