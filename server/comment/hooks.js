'use strict';

const { broadcast, events } = require('./channel');
const pick = require('lodash/pick');

exports.add = (Comment, Hooks) => {
  Comment.addHook(Hooks.afterCreate, comment => {
    comment.getAuthor().then(a => {
      const author = pick(a, ['id', 'email']);
      broadcast(events.CREATE, { ...comment.toJSON(), author });
    });
    comment.getActivity().then(a => {
      const activity = pick(a, ['id', 'data', 'type']);
      broadcast(events.CREATE, { ...comment.toJSON(), activity });
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
