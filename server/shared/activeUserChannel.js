'use strict';

const each = require('lodash/each');
const find = require('lodash/find');
const get = require('lodash/get');
const omit = require('lodash/omit');
const set = require('lodash/set');
const unset = require('lodash/unset');

const sseClients = {};

const activeUsers = {};

const events = {
  ADD_ACTIVE_USER: 'active_user_add',
  REMOVE_ACTIVE_USER: 'active_user_remove'
};

function unsubscribe(courseId, sseClient) {
  return () => {
    unset(sseClients, [courseId, sseClient.id]);
    sseClient.close();
  };
}

function subscribe(req, res) {
  const { id: courseId } = req.params;
  const sseClient = res.sse;
  set(sseClients, [courseId, sseClient.id], sseClient);
  req.on('close', unsubscribe(courseId, sseClient));
}

function broadcast(event, user, context) {
  const { courseId } = context;
  if (event === events.ADD_ACTIVE_USER) setContext(user, context);
  const recipients = get(sseClients, courseId, {});
  each(recipients, r => {
    r.send(event, { user, context: omit(context, ['timer']) });
  });
  return user;
}

function setContext({ id, email }, context) {
  const existingUser = activeUsers[id];
  if (!existingUser) {
    activeUsers[id] = { id, email, contexts: [context] };
    return;
  }
  const existingContext = find(existingUser.contexts, context);
  if (existingContext) return;
  existingUser.contexts.push(context);
}

module.exports = { activeUsers, subscribe, broadcast, events };
