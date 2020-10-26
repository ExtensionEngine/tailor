'use strict';

const { getLevel } = require('../../config/shared/activities');
const mail = require('../shared/mail');
const map = require('lodash/map');
const pick = require('lodash/pick');
const sse = require('../shared/sse');
const without = require('lodash/without');

exports.add = (Comment, Hooks, db) => {
  const { Events } = Comment;

  Comment.addHook(Hooks.afterCreate, async comment => {
    const author = await comment.getAuthor({
      attributes: ['id', 'email', 'firstName', 'lastName', 'fullName', 'imgUrl']
    });
    sse.channel(comment.repositoryId)
      .send(Events.Create, { ...comment.toJSON(), author });
    sendEmailNotification(comment, db);
  });

  Comment.addHook(Hooks.afterUpdate, comment => {
    sse.channel(comment.repositoryId).send(Events.Update, comment);
  });

  Comment.addHook(Hooks.afterDestroy, comment => {
    Comment.findByPk(comment.id, { paranoid: false }).then(comment => {
      sse.channel(comment.repositoryId).send(Events.Delete, comment);
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
  const previousComments = await activity.getComments({
    offset: 1,
    limit: 3,
    order: [['createdAt', 'DESC']],
    include: [{ model: User, as: 'author' }]
  });
  const data = {
    repositoryId: repository.id,
    repositoryName: repository.name,
    activityId: activity.id,
    activityLabel: getLevel(activity.type).label,
    topic: activity.data.name,
    author: author.profile,
    previousComments,
    ...pick(comment, ['id', 'content', 'createdAt'])
  };
  const collaborators = map(repository.repositoryUsers, 'user.email');
  const recipients = without(collaborators, author.email);
  if (recipients.length) mail.sendCommentNotification(recipients, data);
}
