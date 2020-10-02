'use strict';

const activeUsers = require('./store');
const isEqual = require('lodash/isEqual');
const pick = require('lodash/pick');
const sse = require('../../shared/sse');
const { UserActivity } = require('../../../common/sse');

const USER_ATTRS = ['id', 'email', 'firstName', 'lastName', 'fullName', 'imgUrl'];

function subscribe({ user, repository }, { sse }) {
  const { id: sseId } = sse;
  sse.join(repository.id);
  sse.on('close', () => onUnsubscribe({ sseId, user, repository }));
}

function onUnsubscribe({ sseId, user, repository }) {
  activeUsers.removeContext(user, it => it.sseId === sseId);
  const channel = sse.channel(repository.id);
  if (!channel) return;
  channel.send(UserActivity.EndSession, { sseId, userId: user.id });
}

function fetchUserActivities(_req, res) {
  res.json({ data: { items: activeUsers } });
}

function addUserActivity({ user, body: { context } }, res) {
  res.end();
  user = pick(user, USER_ATTRS);
  activeUsers.addContext(user, context);
  const channel = sse.channel(context.repositoryId);
  if (channel) channel.send(UserActivity.Start, { user, context });
}

function removeUserActivity({ user, body: { context } }, res) {
  res.end();
  user = pick(user, USER_ATTRS);
  const { connectedAt, ...targetContext } = context;
  activeUsers.removeContext(user,
    ({ connectedAt, ...context }) => isEqual(context, targetContext));
  const channel = sse.channel(context.repositoryId);
  if (channel) channel.send(UserActivity.End, { user, context });
}

module.exports = {
  subscribe,
  fetchUserActivities,
  addUserActivity,
  removeUserActivity
};
