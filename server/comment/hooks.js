'use strict';

const { broadcast, events } = require('./channel');
const mail = require('../shared/mail');
const reduce = require('lodash/reduce');
const pick = require('lodash/pick');

exports.add = (Comment, Hooks, db) => {
  Comment.addHook(Hooks.afterCreate, comment => {
    comment.getAuthor().then(a => {
      broadcast(events.CREATE, { ...comment.toJSON(), author: a.profile });
      sendEmailNotification(comment, db);
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
  const recipients = reduce(repository.repositoryUsers, (acc, it) => {
    if (it.user.email !== author.email) acc.push(it.user.email);
    return acc;
  }, []);
  mail.sendCommentNotification(recipients, data);
}
