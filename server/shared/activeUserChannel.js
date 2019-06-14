'use strict';

const { activityTimeout } = require('../../config/shared/activeUsers');
const each = require('lodash/each');
const find = require('lodash/find');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const isEqual = require('lodash/isEqual');
const omit = require('lodash/omit');
const remove = require('lodash/remove');
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
  const recipients = get(sseClients, courseId, {});
  each(recipients, r => {
    r.send(event, { user, context: omit(context, ['timer']) });
  });
  return user;
}

function startRemovalTimer(user, context, delay = activityTimeout) {
  return setTimeout(() => {
    removeContext(user, context);
    broadcast(events.REMOVE_ACTIVE_USER, user, context);
  }, delay);
}

// TODO: Do it better
function addContext(user, context) {
  const { id, email, created } = user;
  context.toJSON = () => omit(context, ['timer']);
  const existingUser = activeUsers[id];
  if (!existingUser) {
    context.timer = startRemovalTimer(user, context);
    activeUsers[id] = { id, email, created, contexts: [context] };
    return;
  }
  const omittedContext = omit(context, ['timer', 'toJSON', 'created']);
  const existingContext = find(existingUser.contexts, omittedContext);
  if (existingContext) {
    clearTimeout(existingContext.timer);
    existingContext.timer = startRemovalTimer(user, context);
    return;
  }
  context.timer = startRemovalTimer(user, context);
  existingUser.contexts.push(context);
}

function removeContext(user, context, stopTimer = false) {
  if (!activeUsers[user.id]) return;
  const omittedFields = ['timer', 'toJSON', 'created'];
  remove(activeUsers[user.id].contexts, c => {
    const remove = isEqual(omit(c, omittedFields), omit(context, omittedFields));
    if (stopTimer && remove) clearTimeout(c.timer);
    return remove;
  });
  if (isEmpty(activeUsers[user.id].contexts)) delete activeUsers[user.id];
}

module.exports = { activeUsers, subscribe, broadcast, events, addContext, removeContext };
