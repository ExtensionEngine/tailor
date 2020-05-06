'use strict';

const ActiveUsers = require('./store');
const Events = require('./Events');
const isEqual = require('lodash/isEqual');
const pick = require('lodash/pick');
const sse = require('../shared/sse');

function fetch(_req, res) {
  const activeUsers = ActiveUsers;
  res.json({
    data: { activeUsers }
  });
}

function add({ body, user }, res) {
  res.end();
  const { context } = body;
  user = pick(user, ['id', 'email', 'firstName', 'lastName']);
  ActiveUsers.addContext(user, context);
  const channel = sse.channel(context.repositoryId);
  if (channel) channel.send(Events.Add, { user, context });
}

function remove({ body, user }, res) {
  res.end();
  const { context } = body;
  const { created, ...targetContext } = context;
  user = pick(user, ['id', 'email', 'firstName', 'lastName']);
  ActiveUsers.removeContext(user, ({ created, ...context }) => {
    return isEqual(context, targetContext);
  });
  const channel = sse.channel(context.repositoryId);
  if (channel) channel.send(Events.Remove, { user, context });
}

function subscribe({ repository, user }, { sse }) {
  const { id: sseId } = sse;
  sse.join(repository.id);
  sse.on('close', () => onUnsubscribe({ repository, sseId, user }));
}

function onUnsubscribe({ repository, sseId, user }) {
  ActiveUsers.removeContext(user, context => context.sseId === sseId);
  const channel = sse.channel(repository.id);
  const { id: userId } = user;
  if (channel) channel.send(Events.RemoveSession, { userId, sseId });
}

module.exports = {
  fetch,
  add,
  remove,
  subscribe
};
