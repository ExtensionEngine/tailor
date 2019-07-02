'use strict';

const isEmpty = require('lodash/isEmpty');
const isEqual = require('lodash/isEqual');
const omit = require('lodash/omit');
const remove = require('lodash/remove');

const activeUsers = {};

function addContext(user, context) {
  const { id, email, created } = user;
  const existingUser = activeUsers[id];
  if (!existingUser) {
    activeUsers[id] = { id, email, created, contexts: [context] };
    return;
  }
  existingUser.contexts.push(context);
}

function removeContext(user, context) {
  if (!activeUsers[user.id]) return;
  remove(activeUsers[user.id].contexts, c => {
    const remove = isEqual(omit(c, ['created']), omit(context, ['created']));
    return remove;
  });
  if (isEmpty(activeUsers[user.id].contexts)) delete activeUsers[user.id];
}

function removeActiveUser(userId, sseId) {
  if (!activeUsers[userId]) return;
  remove(activeUsers[userId].contexts, c => c.sseId === sseId);
  if (isEmpty(activeUsers[userId].contexts)) delete activeUsers[userId];
}

module.exports = { activeUsers, addContext, removeContext, removeActiveUser };
