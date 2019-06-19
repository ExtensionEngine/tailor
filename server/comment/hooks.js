'use strict';

const { broadcast, events } = require('./channel');
const pick = require('lodash/pick');

exports.add = (Comment, Hooks) => {
  Comment.addHook(Hooks.afterCreate, comment => {
    comment.getAuthor().then(a => {
      const author = pick(a, ['id', 'email']);
      const data = { comment: { ...comment.toJSON(), author } };
      broadcast(events.CREATE, comment.courseId, data);
    });
  });

  Comment.addHook(Hooks.afterUpdate, comment => {
    broadcast(events.UPDATE, comment.courseId, { comment });
  });

  Comment.addHook(Hooks.afterDestroy, comment => {
    Comment.findByPk(comment.id, { paranoid: false }).then(deleted => {
      broadcast(events.DELETE, comment.courseId, { deleted });
    });
  });
};
