'use strict';

const mail = require('../shared/mail');
const map = require('lodash/map');
const pick = require('lodash/pick');
const sse = require('../shared/sse');
const without = require('lodash/without');

exports.add = (Comment, Hooks, db) => {
  const { Events } = Comment;

  Comment.addHook(Hooks.afterCreate, comment => {
    comment.getAuthor().then(a => {
      const author = { id: a.id, email: a.email };
      const channel = sse.channel(comment.repositoryId);
      if (channel) channel.send(Events.Create, { ...comment.toJSON(), author });
      sendEmailNotification(comment, db);
    });
  });

  Comment.addHook(Hooks.afterUpdate, comment => {
    const channel = sse.channel(comment.courseId);
    if (channel) channel.send(Events.Update, comment);
  });

  Comment.addHook(Hooks.afterDestroy, comment => {
    Comment.findByPk(comment.id, { paranoid: false }).then(comment => {
      const channel = sse.channel(comment.courseId);
      if (channel) channel.send(Events.Delete, comment);
    });
  });
};

async function sendEmailNotification(comment, db) {
  const { Repository, RepositoryUser, Activity, User } = db;
  await comment.reload({
    include: [
      {
        model: Repository,
        include: [{ model: RepositoryUser, include: { model: User } }]
      },
      { model: Activity },
      { model: User, as: 'author' }
    ]
  });
  const { author, repository, activity } = comment;
  const data = {
    repository: repository.name,
    topic: activity.data.name,
    author: author.profile,
    ...pick(comment, ['id', 'content', 'createdAt'])
  };
  const collaborators = map(repository.repositoryUsers, 'user.email');
  const recipients = without(collaborators, author.email);
  if (recipients.length) mail.sendCommentNotification(recipients, data);
}
