'use strict';

const activeUsers = require('./store');
const isEqual = require('lodash/isEqual');
const pick = require('lodash/pick');
const sse = require('../../shared/sse');
const { UserActivity } = require('../../../common/sse');

const USER_ATTRS = ['id', 'email', 'firstName', 'lastName', 'fullName', 'imgUrl'];

function subscribe({ repository }, { sse: connection }) {
  connection.once('close', () => onUnsubscribe(connection));
  connection.join(repository.id);
}

function onUnsubscribe({ id: sseId, request }) {
  const { repository, user } = request;
  activeUsers.removeContext(user, it => it.sseId === sseId);
  sse.channel(repository.id)
    .send(UserActivity.EndSession, { sseId, userId: user.id });
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
