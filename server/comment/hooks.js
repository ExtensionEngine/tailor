'use strict';

exports.add = (Comment, Hooks) => {
  const { Events } = Comment;

  Comment.addHook(Hooks.afterCreate, comment => {
    comment.getAuthor().then(({ id, email }) => {
      const author = { id, email };
      const feed = Comment.feeds.get(String(comment.courseId));
      if (feed) feed.send(Events.Create, { ...comment.toJSON(), author });
    });
  });

  Comment.addHook(Hooks.afterUpdate, comment => {
    const feed = Comment.feeds.get(String(comment.courseId));
    if (feed) feed.send(Events.Update, comment);
  });

  Comment.addHook(Hooks.afterDestroy, comment => {
    Comment.findByPk(comment.id, { paranoid: false }).then(comment => {
      const feed = Comment.feeds.get(String(comment.courseId));
      if (feed) feed.send(Events.Delete, comment);
    });
  });
};
