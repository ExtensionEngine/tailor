'use strict';

const activeUsers = require('./store');
const isEqual = require('lodash/isEqual');
const pick = require('lodash/pick');
const sse = require('../../shared/sse');
const { UserActivity } = require('../../../common/sse');

const USER_ATTRS = [
  'id', 'email', 'firstName', 'lastName', 'fullName', 'label', 'imgUrl'
];

function subscribe({ repository, user }, { sse: connection }) {
  connection.once('close', () => onUnsubscribe(connection, { repository, user }));
  connection.join(repository.id);
}

function onUnsubscribe(connection, { repository, user }) {
  activeUsers.removeContext(user, it => it.sseId === connection.id);
  sse.channel(repository.id)
    .send(UserActivity.EndSession, { sseId: connection.id, userId: user.id });
}

function fetchUserActivities(_req, res) {
  res.json({ data: { items: activeUsers } });
}

function addUserActivity({ user, body: { context } }, res) {
  res.end();
  user = pick(user, USER_ATTRS);
  activeUsers.addContext(user, context);
  sse.channel(context.repositoryId).send(UserActivity.Start, { user, context });
}

function removeUserActivity({ user, body: { context } }, res) {
  res.end();
  user = pick(user, USER_ATTRS);
  const { connectedAt, ...targetCtx } = context;
  const compareBy = Object.keys(targetCtx);
  activeUsers.removeContext(user, it => isEqual(pick(it, compareBy), targetCtx));
  sse.channel(context.repositoryId).send(UserActivity.End, { user, context });
}

module.exports = {
  subscribe,
  fetchUserActivities,
  addUserActivity,
  removeUserActivity
};
