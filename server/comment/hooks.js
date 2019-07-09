'use strict';

const sse = require('../shared/sse');

exports.add = (Comment, Hooks) => {
  const { Events } = Comment;

  Comment.addHook(Hooks.afterCreate, comment => {
    comment.getAuthor().then(({ id, email }) => {
      const author = { id, email };
      const channel = sse.channel(String(comment.courseId));
      if (channel) channel.send(Events.Create, { ...comment.toJSON(), author });
    });
  });

  Comment.addHook(Hooks.afterUpdate, comment => {
    const channel = sse.channel(String(comment.courseId));
    if (channel) channel.send(Events.Update, comment);
  });

  Comment.addHook(Hooks.afterDestroy, comment => {
    Comment.findByPk(comment.id, { paranoid: false }).then(comment => {
      const channel = sse.channel(String(comment.courseId));
      if (channel) channel.send(Events.Delete, comment);
    });
  });
};
