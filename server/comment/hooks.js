'use strict';

const { getLevel } = require('../../config/shared/activities');
const mail = require('../shared/mail');
const map = require('lodash/map');
const pick = require('lodash/pick');
const sse = require('../shared/sse');
const without = require('lodash/without');

exports.add = (Comment, Hooks, db) => {
  const { Events } = Comment;
  const { Repository, RepositoryUser, Activity, ContentElement, User } = db;

  const includeElement = {
    model: ContentElement, as: 'contentElement', attributes: ['uid', 'type']
  };

  Comment.addHook(Hooks.afterCreate, async comment => {
    await unresolveComments(comment);
    const includeAuthor = {
      model: User,
      as: 'author',
      attributes: ['id', 'email', 'label', 'imgUrl']
    };
    const include = [includeAuthor, includeElement];
    const { author, contentElement } = await comment.reload({ include });
    sse.channel(comment.repositoryId)
      .send(Events.Create, { ...comment.toJSON(), author, contentElement });
    sendEmailNotification(comment);
  });

  Comment.addHook(Hooks.afterUpdate, comment => {
    sse.channel(comment.repositoryId).send(Events.Update, comment);
    sendEmailNotification(comment, { isCreate: false });
  });

  Comment.addHook(Hooks.afterDestroy, comment => {
    Comment.findByPk(comment.id, { paranoid: false }).then(comment => {
      sse.channel(comment.repositoryId).send(Events.Delete, comment);
    });
  });

  async function sendEmailNotification(comment, { isCreate = true } = {}) {
    await comment.reload({
      include: [
        {
          model: Repository,
          include: [{ model: RepositoryUser, include: { model: User } }]
        },
        { model: Activity, attributes: ['id', 'type', 'data'] },
        { model: User, as: 'author' },
        includeElement
      ]
    });
    const { author, repository, activity, contentElement } = comment;
    const options = {
      offset: 1,
      limit: 3,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'author' }]
    };
    const previousComments = isCreate ? await activity.getComments(options) : [];
    const data = {
      repositoryId: repository.id,
      repositoryName: repository.name,
      activityId: activity.id,
      elementUid: contentElement && contentElement.uid,
      activityLabel: getLevel(activity.type).label,
      topic: activity.data.name,
      author: author.profile,
      previousComments,
      action: isCreate ? 'left' : 'updated',
      ...pick(comment, ['id', 'content', 'createdAt'])
    };
    const collaborators = map(repository.repositoryUsers, 'user.email');
    const recipients = without(collaborators, author.email);
    if (recipients.length) mail.sendCommentNotification(recipients, data);
  }

  function unresolveComments({ contentElementId }) {
    if (!contentElementId) return;
    const where = { contentElementId };
    return Comment.update({ resolvedAt: null }, { where, paranoid: false });
  }
};
