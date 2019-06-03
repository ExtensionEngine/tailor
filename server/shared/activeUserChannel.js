'use strict';

const each = require('lodash/each');
const find = require('lodash/find');
const get = require('lodash/get');
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

function broadcast(event, activeUser, context) {
  const { courseId } = context;
  setContext(activeUser, context);
  const recipients = get(sseClients, courseId, {});
  each(recipients, r => {
    r.send(event, activeUser);
  });
  return activeUser;
}

function setContext(user, context) {
  const existingUser = activeUsers[user.id];
  if (!existingUser) {
    activeUsers[user.id] = [context];
    return;
  }
  const existingContext = find(existingUser, context);
  if (existingContext) return;
  existingUser.push(context);
}

module.exports = { subscribe, broadcast, events };
